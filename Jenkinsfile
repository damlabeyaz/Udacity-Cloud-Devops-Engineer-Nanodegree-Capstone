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

    stage('Lint HTML') {
        echo 'Linting HTML files...'
        sh 'tidy -q -e ./blue/*.html'
        sh 'tidy -q -e ./green/*.html'
    }
    
    stage('Linting Dockerfiles') {
        echo 'Downloading hadolint...'
        sh 'wget -O ./hadolint https://github.com/hadolint/hadolint/releases/download/v2.5.0/hadolint-Darwin-x86_64'
        sh 'chmod +x ./hadolint'
        echo 'Linting Dockerfiles with hadolint...'
        sh './hadolint ./blue/Dockerfile'
        sh './hadolint ./green/Dockerfile'
    }

    stage('Building Docker image for blue app') {
        echo 'Building and push Docker image...'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
	     	sh 'docker login -u $USERNAME -p $PASSWORD'
	     	sh 'docker build -t damlabeyaz/capstone-blue blue/.'
	     	sh 'docker tag damlabeyaz/capstone-blue damlabeyaz/capstone-blue'
	     	sh 'docker push damlabeyaz/capstone-blue'
        }
    }

    stage('Building Docker image for green app') {
        echo 'Building and push Docker image...'
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
	     	sh 'docker login -u $USERNAME -p $PASSWORD'
	     	sh 'docker build -t damlabeyaz/capstone-green green/.'
	     	sh 'docker tag damlabeyaz/capstone-green damlabeyaz/capstone-green'
	     	sh 'docker push damlabeyaz/capstone-green'
        }
    }

    stage('Check if EKS clusters are running') {
        echo 'Check if AWS EKS clusters are running...'
        sh 'eksctl get clusters --region=us-east-2'
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
            sh 'kubectl get svc'
        }
      }
    }

    stage('Checking if service is running') {
        echo 'Checking if service is running'
        withAWS(credentials: 'Jenkins Capstone User', region: 'us-east-2') {
            sh 'curl ac5724ee509324674a4a40af42e61f3d-1421565175.us-east-2.elb.amazonaws.com:8000'
        }
    }
}