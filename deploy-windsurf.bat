@echo off
echo 🚀 Deploying Crabtree Bay Studio to windsurf-ai-project
echo.

echo Step 1: Set your project
gcloud config set project windsurf-ai-project

echo.
echo Step 2: Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

echo.
echo Step 3: Create Artifact Registry repository
gcloud artifacts repositories create crabtree-bay-studio-repo --repository-format=docker --location=us-central1 --description="Repository for Crabtree Bay Studio"

echo.
echo Step 4: Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev

echo.
echo Step 5: Deploy to Cloud Run (this will build and deploy in one step)
gcloud run deploy crabtree-bay-studio --source . --platform managed --region us-central1 --allow-unauthenticated --port 3000 --memory 512Mi --cpu 1 --min-instances 0 --max-instances 10

echo.
echo 🎉 Deployment complete!
echo Your app will be available at the URL shown above.
pause
