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
        sh 'hadolint ./blue/Dockerfile'
        sh 'hadolint ./green/Dockerfile'
    }

    stage('Building Docker image for blue app') {
        echo 'Building and push Docker image...'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
	     	sh 'docker login -u $USERNAME -p $PASSWORD'
	     	sh 'docker build -t capstone-app-blue blue/.'
            sh 'docker tag damlabeyaz/capstone-app-blue:latest damlabeyaz/capstone-app-blue:latest'
	     	sh 'docker push damlabeyaz/capstone-app-blue:latest'
        }
    }

    stage('Building Docker image for green app') {
        echo 'Building and push Docker image...'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
	     	sh 'docker login -u $USERNAME -p $PASSWORD'
	     	sh 'docker build -t capstone-app-green green/.'
            sh 'docker tag damlabeyaz/capstone-app-green:latest damlabeyaz/capstone-app-green:latest'
	     	sh 'docker push damlabeyaz/capstone-app-green:latest'
        }
    }

    stage('Check if EKS clusters are running') {
        echo 'Check if AWS EKS clusters are running...'
        sh 'eksctl get clusters'
    }

    stage('Deploying to AWS EKS') {
        echo 'Deploying to AWS EKS...'
        dir ('./') {
        withAWS(credentials: 'Jenkins Capstone User', region: 'us-east-2') {
            sh 'aws eks --region us-east-2 update-kubeconfig --name capstoneclusterdamlabeyaz'
            sh 'kubectl apply -f blue/blue-controller.json'
            sh 'kubectl apply -f green/green-controller.json'
            sh 'kubectl apply -f ./blue-green-service.json'
            sh 'kubectl get nodes'
            sh 'kubectl get pods'
        }
      }
    }

}