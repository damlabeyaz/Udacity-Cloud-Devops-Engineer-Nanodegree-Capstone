# Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone

In this project I will apply the skills and knowledge which were developed throughout the Cloud DevOps Nanodegree program. These include:

* Working in AWS
* Using Jenkins or Circle CI to implement Continuous Integration and Continuous Deployment
* Building pipelines
* Working with Ansible and CloudFormation to deploy clusters
* Building Kubernetes clusters
* Building Docker containers in pipelines

I will develop a CI/CD pipeline with Jenkins for a simple micro service application written in Node.js and take theblue/green deployment strategy. I will also develop further Continuous Integration steps as typographical checking (aka “linting”) to mimic real-world development as much as possible. To make my project stand out, I may also choose to implement other checks such as security scanning, performance testing, smoke testing and promoting the new version of the app.

## My Complete Steps

1. For the Docker application the directions are rather more open-ended. I can choose an application and decided to build a sample app in [Node.js](https://github.com/nodejs) which is a simple web server returning a "Hello World in Blue" message with a blue deployment and "Hello World in Green" message with a green deployment. This shows that I decided for the blue/green deployment strategy.

2. For this project, I decided to use Jenkins on my local machine as a CI server. To set up Jenkins on MacOS, I used [this tutorial](https://coralogix.com/blog/how-to-install-and-configure-jenkins-on-the-mac-os/). If there are any missing writing permissions during the installation with brew, checkout [this](https://apple.stackexchange.com/questions/144785/cannot-update-homebrew-permission-denied) discussion on Stackoverflow.

3. After the installation of Jenkins, I installed some useful Jenkins plugins: Blue Ocean and AWS Steps.

4. Then I configured the AWS Steps plugin in Jenkins so that Jenkins can communicate with AWS. For this step, I firstly created a new IAM Role on AWS with programmatic admin access. Afterwards, I configured Jenkins by adding the credentials by following [this tutorial](https://www.howtoforge.com/how-to-store-aws-user-access-key-and-secret-key-in-jenkins/).

5. I made sure that my AWS CLI tool is configured correctly. I used `aws configure` to do so.

6. The next step was to configure my DockerHub credentials within Jenkins. I followed [this tutorial](https://dzone.com/articles/building-docker-images-to-docker-hub-using-jenkins) to add my DockerHub credentials.

7. For the creation of a Kubernetes cluster I decided to use the AWS EKS service. I wanted to create this cluster from my local machine and learnt that there is a CLI tool called `eksctl` provided by AWS. I installed it on my local MacOS machine following [this tutorial](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html).

8. Then, I created a Kubernetes cluster on AWS EKS with the following script (this may take a while to finish):

```
eksctl create cluster --name capstoneclusterdamlabeyaz --version 1.16 --nodegroup-name standard-workers --node-type t2.micro --nodes 3 --nodes-min 1 --nodes-max 4 --node-ami auto
```

9. The command above will create two CloudFormation scripts: the [cluster](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/infrastructure/eks-cluster.json) and the [node group](https://github.com/damlabeyaz/Udacity-Cloud-Devops-Engineer-Nanodegree-Capstone/blob/main/infrastructure/nodegroup.json). These can be used to create the cluster if the usage of `eksctl` is not allowed.

10. Afterwards, I created two Dockerfiles for each app (blue and green). I added a linting step to show that if I have errors in my Dockerfile, the linting returns and error and the whole pipeline fails. 