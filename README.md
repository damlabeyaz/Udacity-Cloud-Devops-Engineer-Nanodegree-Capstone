# Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone

In this project I will apply the skills and knowledge which were developed throughout the Cloud DevOps Nanodegree program. These include:

* Working in AWS
* Using Jenkins or Circle CI to implement Continuous Integration and Continuous Deployment
* Building pipelines
* Working with Ansible and CloudFormation to deploy clusters
* Building Kubernetes clusters
* Building Docker containers in pipelines

I will develop a CI/CD pipeline with Jenkins for a simple website and will use the blue/green deployment strategy. I will also develop further Continuous Integration steps as typographical checking (aka “linting”) to mimic real-world development as much as possible.

## URL
Here is the URL for my deployed application (green stage): http://ac5724ee509324674a4a40af42e61f3d-1421565175.us-east-2.elb.amazonaws.com:8000/

## My Workflow

In the following section I describe in which order I worked to complete the project submission requirements.

### 1. Jenkins Setup

* For this project, I decided to use Jenkins on my local MacOS machine as a CI server. Of course, a student can create an AWS EC2 instance and install Jenkins there but to speed up my debugging I decided for the on-premise solution. If you want to have a cloud-based solution, just instantiate an AWS EC2 instance, SSH into it and complete the same steps.

* To set up Jenkins on MacOS, I used [this tutorial](https://coralogix.com/blog/how-to-install-and-configure-jenkins-on-the-mac-os/). If there are any missing writing permissions during the installation with brew, checkout [this](https://apple.stackexchange.com/questions/144785/cannot-update-homebrew-permission-denied) discussion on Stackoverflow.

* After the installation of Jenkins, I installed some useful Jenkins plugins, like [Blue Ocean](https://www.jenkins.io/projects/blueocean/) and [AWS Steps](https://www.jenkins.io/doc/pipeline/steps/pipeline-aws/).

* Then I configured the AWS Steps plugin in Jenkins so that Jenkins can communicate with AWS. For this step, I firstly created a new *IAM User* on AWS with programmatic admin access called *capstone-user* ( [SCREENSHOT1](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT1.png)). Afterwards, I configured Jenkins by adding the credentials ([SCREENSHOT2](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT2.png)) by following [this tutorial](https://www.howtoforge.com/how-to-store-aws-user-access-key-and-secret-key-in-jenkins/).

* The next step was to configure my DockerHub credentials within Jenkins ([SCREENSHOT3](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT3.png)). I followed [this tutorial](https://dzone.com/articles/building-docker-images-to-docker-hub-using-jenkins) to add my DockerHub credentials.

### 2. Configure AWS CLI

I made sure that my AWS CLI tool is configured correctly. I used `aws configure` to do so and added the key and secret from my newly created user to the configuration.

### 3. Create Kubernetes Cluster

* For the creation of a Kubernetes cluster I decided to use the AWS EKS service. I wanted to create this cluster from my local machine and learnt that there is a CLI tool called `eksctl` provided by AWS. I installed it on my local MacOS machine following [this tutorial](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html).

* Then, I created a Kubernetes cluster on AWS EKS with the following script ([SCREENSHOT4](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT4.png)):

```
eksctl create cluster --name capstoneclusterdamlabeyaz --version 1.16 --nodegroup-name standard-workers --node-type t2.micro --nodes 3 --nodes-min 1 --nodes-max 4 --node-ami auto --region=use-east-2
```

* The command above will create two CloudFormation scripts ([SCREENSHOT5](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT5.png)): the [cluster](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/infrastructure/eks-cluster.json) and the [node group](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/infrastructure/nodegroup.json). These can be used to create the cluster if the usage of `eksctl` is not allowed.

### 4. Choose a deployment strategy

We were allowed to choose between a blue/green and rolling deployment strategy. I decided to use the *blue//green deployment strategy* since we also practice this in our company. During my research, I found a good [article by Alvaro Andres Pinzon Cortes](https://andresaaap.medium.com/simple-blue-green-deployment-in-kubernetes-using-minikube-b88907b2e267) who describes how to realize a blue/green deployment with Kubernetes.

### 5. Create Dockerfiles

Since I chose a blue/green deployment, I created two Dockerfiles for each app (blue and green):

```
FROM nginx:1.21.0

## Step 1:
RUN rm /usr/share/nginx/html/index.html

## Step 2:
# Copy source code to working directory
COPY index.html /usr/share/nginx/html
```

The first line tells it that it’s an NGINX application with the version `1.21.0`. You can also leave out the version but I prefer to write it. In the first step we remove the existing `index.html` file from the NGINX application and in the second step we copy our `index.html` file into NGINX' directory.

### 6. Create replication controllers for the blue and green pods

Following [this tutorial](https://andresaaap.medium.com/simple-blue-green-deployment-in-kubernetes-using-minikube-b88907b2e267) I created a replication controller for both of my pods (blue and green). [This article](https://www.mirantis.com/blog/kubernetes-replication-controller-replica-set-and-deployments-understanding-replication-options/) describeds well why we should use a replication controller.

### 7. Prepare Jenkinsfile - Checkout and Environment Check

This is not a required step but I prefer to check if some needed tools are available ([SCREENSHOT7](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT7.png)) after I checked out my code ([SCREENSHOT6](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT6.png)):

```
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
```

### 8. Prepare Jenkinsfile - Linting

As a minimum for our pipeline, we needed to add a linting step:

```
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
```

To prove that my linting is working I added a random string and let my pipeline fail due to a wrong linting ([SCREENSHOT8](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT8.png)).

### 9. Prepare Jenkinsfile - Docker image build and push

After the linting, we build and push the docker images for both blue ([SCREENSHOT9](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT9.png)) and green app ([SCREENSHOT10](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT10.png)) to DockerHub:

```
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
```

Afterwards I checked and could see that my images sucessfully pushed to DockerHub ([SCREENSHOT11](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT11.png)).

### 10. Prepare Jenkinsfile - Check and deploy blue deployment

Now, we are ready to deploy our application to AWS EKS. Firstly, I check if the cluster is up and running ([SCREENSHOT12](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT12.png)):

```
stage('Check if EKS clusters are running') {
    echo 'Check if AWS EKS clusters are running...'
    sh 'eksctl get clusters --region=us-east-2'
}
```

Then I update my cluster information with `kubeconfig` and deploy the blue application and afterwards the green application ([SCREENSHOT13](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT13.png)). With the file `blue-green-service.json` we create a Load Balancer for our application so that we can route between the blue and green deployment:

```
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
```

The command `kubectl get svc` will show us the URL of our Load Balancer ([SCREENSHOT14](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT14.png)). This can be used to call our blue deployment.

We can call the blue version of our app in a browser and can see that it was sucessfully deployed ([SCREENSHOT15](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT15.png))

### 10. Change service to green deployment

To change our service from blue to green, we simply need to change 

```
"selector":{
    "app":"blue"
},
```

to 

```
"selector":{
    "app":"green"
},
```

in our `blue-green-service.json` file. Afterwards, we run `kubectl apply -f ./blue-green-service.json` again and can see the green deployment in our browser ([SCREENSHOT16](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT16.png)).

### 11. Smoke testing

This was not a required step, but I recommend to make a simple smoke test. That's why I added one to my pipeline:

```
stage('Checking if service is running') {
    steps{
        echo 'Checking if service is running'
        withAWS(credentials: 'Jenkins Capstone User', region: 'us-east-2') {
            sh 'curl ac5724ee509324674a4a40af42e61f3d-1421565175.us-east-2.elb.amazonaws.com:8000'
        }
    }
}
```

The results are promising ([SCREENSHOT17](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/screenshots/SCREENSHOT17.png)).