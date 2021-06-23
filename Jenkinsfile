pipeline {

    agent any

    stages {
    
        stage('Checking out git repo') {
            steps {
                echo 'Checkout...'
                checkout scm
            }
            
        }
    
        stage('Checking environment') {
            steps {
                echo 'Checking environment...'
                sh 'git --version'
                sh 'docker -v'
                sh 'eksctl version'
                sh 'hadolint --version'
            }
        }
    }
}