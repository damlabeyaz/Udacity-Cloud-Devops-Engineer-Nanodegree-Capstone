node {
    
    stage('Checking out git repo') {
        echo 'Checkout...'
        checkout scm
    }

    stage('Checking environment') {
        echo 'Checking environment...'
        sh 'git --version'
        sh 'docker -v'
        sh 'eksctl version'
    }
    
    stage('Linting Dockerfiles') {
        echo 'Linting...'
        sh 'hadolint ./app/blue/Dockerfile'
        sh 'hadolint ./app/green/Dockerfile'
    }

    stage('Building Docker image for blue app') {
        echo 'Building and push Docker image...'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
	     	sh 'docker login -u $USERNAME -p $PASSWORD'
	     	sh 'docker build -t capstone-app-blue app/blue/.'
            sh 'docker tag capstone-app-blue:latest damlabeyaz/capstone-app-blue:latest'
	     	sh 'docker push damlabeyaz/capstone-app-blue:latest'
        }
    }

    stage('Building Docker image for blue green') {
        echo 'Building and push Docker image...'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
	     	sh 'docker login -u $USERNAME -p $PASSWORD'
	     	sh 'docker build -t capstone-app-green app/green/.'
            sh 'docker tag capstone-app-green:latest damlabeyaz/capstone-app-green:latest'
	     	sh 'docker push damlabeyaz/capstone-app-green:latest'
        }
    }
}