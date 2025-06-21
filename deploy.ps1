# Google Cloud Run Deployment Script for Windows PowerShell
param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "crabtree-bay-studio"
)

Write-Host "🚀 Deploying Crabtree Bay Studio to Google Cloud Run" -ForegroundColor Green

# Set the project
Write-Host "Setting Google Cloud project to: $ProjectId" -ForegroundColor Yellow
gcloud config set project $ProjectId

# Enable required APIs
Write-Host "Enabling required Google Cloud APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Create Artifact Registry repository
Write-Host "Creating Artifact Registry repository..." -ForegroundColor Yellow
$repoName = "crabtree-bay-studio-repo"
gcloud artifacts repositories create $repoName --repository-format=docker --location=$Region --description="Repository for Crabtree Bay Studio"

# Configure Docker authentication
Write-Host "Configuring Docker authentication..." -ForegroundColor Yellow
gcloud auth configure-docker "$Region-docker.pkg.dev"

# Build and push the Docker image
Write-Host "Building and pushing Docker image..." -ForegroundColor Yellow
$imageName = "$Region-docker.pkg.dev/$ProjectId/$repoName/$ServiceName"
gcloud builds submit --tag $imageName

# Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --image $imageName `
    --platform managed `
    --region $Region `
    --allow-unauthenticated `
    --port 3000 `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10 `
    --set-env-vars "NODE_ENV=production"

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "Your app should be available at the URL shown above." -ForegroundColor Cyan
