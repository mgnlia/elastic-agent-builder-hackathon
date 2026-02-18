#!/usr/bin/env node
/**
 * Deploy to Vercel using the REST API + GitHub integration.
 * Creates a project linked to the GitHub repo, then triggers a production deployment.
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
if (!VERCEL_TOKEN) {
  console.error("❌ VERCEL_TOKEN not set");
  process.exit(1);
}

const API = "https://api.vercel.com";
const headers = {
  Authorization: `Bearer ${VERCEL_TOKEN}`,
  "Content-Type": "application/json",
};

const REPO = "mgnlia/elastic-agent-builder-hackathon";
const PROJECT_NAME = "elastic-incident-commander";

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, { headers, ...opts });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok && res.status !== 409) {
    console.error(`API ${res.status}: ${path}`, data);
    throw new Error(`API ${res.status}`);
  }
  return data;
}

async function main() {
  // Step 1: Check if project exists, create if not
  console.log(`🔍 Checking project "${PROJECT_NAME}"...`);
  let project;
  try {
    project = await api(`/v9/projects/${PROJECT_NAME}`);
    console.log(`✅ Project exists: ${project.id}`);
  } catch {
    console.log(`📦 Creating project "${PROJECT_NAME}"...`);
    project = await api("/v10/projects", {
      method: "POST",
      body: JSON.stringify({
        name: PROJECT_NAME,
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: REPO,
        },
      }),
    });
    console.log(`✅ Project created: ${project.id}`);
  }

  // Step 2: Create a deployment from the git repo
  console.log(`🚀 Creating production deployment from ${REPO}...`);
  const deployment = await api("/v13/deployments", {
    method: "POST",
    body: JSON.stringify({
      name: PROJECT_NAME,
      project: project.id,
      target: "production",
      gitSource: {
        type: "github",
        org: "mgnlia",
        repo: "elastic-agent-builder-hackathon",
        ref: "main",
      },
    }),
  });

  console.log(`📋 Deployment ID: ${deployment.id}`);
  console.log(`🔗 URL: https://${deployment.url}`);

  // Step 3: Wait for deployment to complete
  console.log("⏳ Waiting for build...");
  let status = deployment.readyState || deployment.status;
  let url = deployment.url;
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  while (status !== "READY" && status !== "ERROR" && attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 5000));
    attempts++;
    try {
      const check = await api(`/v13/deployments/${deployment.id}`);
      status = check.readyState || check.status;
      url = check.url || url;
      const elapsed = attempts * 5;
      console.log(`  [${elapsed}s] Status: ${status}`);
    } catch (e) {
      console.log(`  [${attempts * 5}s] Check failed, retrying...`);
    }
  }

  if (status === "READY") {
    console.log(`\n✅ DEPLOYMENT SUCCESSFUL!`);
    console.log(`🌐 Production URL: https://${url}`);
    
    // Try to get the production domain
    try {
      const domains = await api(`/v9/projects/${PROJECT_NAME}/domains`);
      if (domains.domains && domains.domains.length > 0) {
        for (const d of domains.domains) {
          console.log(`🌐 Domain: https://${d.name}`);
        }
      }
    } catch {}
    
    // Also show the .vercel.app URL
    console.log(`🌐 Vercel URL: https://${PROJECT_NAME}.vercel.app`);
  } else if (status === "ERROR") {
    console.error(`\n❌ DEPLOYMENT FAILED`);
    try {
      const events = await api(`/v2/deployments/${deployment.id}/events`);
      const errors = events.filter?.((e) => e.type === "error") || [];
      for (const err of errors) {
        console.error(`  Error: ${err.text || JSON.stringify(err)}`);
      }
    } catch {}
    process.exit(1);
  } else {
    console.log(`\n⚠️ Timed out waiting. Check: https://vercel.com/dashboard`);
    console.log(`🔗 Deployment: https://${url}`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
