pipeline {
  agent any
  environment {
    NODE_VERSION = '20'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install') {
      steps { sh 'npm ci' }
    }
    stage('Lint') {
      steps { sh 'npm run lint' }
    }
    stage('Typecheck') {
      steps { sh 'npm run typecheck' }
    }
    stage('Test') {
      steps { sh 'npm run test:coverage' }
    }
    stage('Build') {
      steps { sh 'npm run build' }
    }
    stage('Optional Deploy') {
      when { environment name: 'VERCEL_TOKEN', value: '' }
      steps {
        echo 'VERCEL_TOKEN not set, skipping deploy'
      }
    }
  }
  post {
    always { junit '**/test-results/*.xml' }
  }
}
