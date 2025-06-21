@echo off
echo 🚀 Manual Deployment Steps for Crabtree Bay Studio
echo.

echo Step 1: Check if you're authenticated
echo Run this command:
echo gcloud auth list
echo.

echo Step 2: List your projects (or create one)
echo Run this command:
echo gcloud projects list
echo.

echo Step 3: Set your project ID
echo Run this command (replace YOUR_PROJECT_ID):
echo gcloud config set project YOUR_PROJECT_ID
echo.

echo Step 4: Enable required APIs
echo gcloud services enable cloudbuild.googleapis.com
echo gcloud services enable run.googleapis.com  
echo gcloud services enable artifactregistry.googleapis.com
echo.

echo Step 5: Create repository
echo gcloud artifacts repositories create crabtree-bay-studio-repo --repository-format=docker --location=us-central1 --description="Repository for Crabtree Bay Studio"
echo.

echo Step 6: Configure Docker
echo gcloud auth configure-docker us-central1-docker.pkg.dev
echo.

echo Step 7: Build and deploy
echo gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/crabtree-bay-studio-repo/crabtree-bay-studio
echo.

echo Step 8: Deploy to Cloud Run
echo gcloud run deploy crabtree-bay-studio --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/crabtree-bay-studio-repo/crabtree-bay-studio --platform managed --region us-central1 --allow-unauthenticated --port 3000 --memory 512Mi --cpu 1 --min-instances 0 --max-instances 10
echo.

echo Replace YOUR_PROJECT_ID with your actual Google Cloud project ID
pause
