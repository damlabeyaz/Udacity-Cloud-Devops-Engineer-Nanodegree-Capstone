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
        withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
	     	sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPassword}"
	     	sh "docker build -t capstone-app-blue app/blue/."
	     	sh "docker tag capstone-app-blue damlabeyaz/capstone-app-blue"
	     	sh "docker push damlabeyaz/capstone-app-blue"
        }
    }
}