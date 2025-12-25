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
      steps { sh 'npm run test:coverage -- --reporter=junit --outputFile=test-results/junit.xml' }
    }
    stage('Build') {
      steps { sh 'npm run build' }
    }
    stage('Optional Deploy') {
      when {
        expression { return env.VERCEL_TOKEN?.trim() }
      }
      steps {
        echo 'Deploying to Vercel...'
        sh 'npx vercel --prod --token=$VERCEL_TOKEN'
      }
    }
  }
  post {
    always {
      junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
    }
  }
}
