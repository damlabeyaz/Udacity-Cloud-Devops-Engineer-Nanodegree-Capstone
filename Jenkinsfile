node {
    
    stage('Checking out git repo') {
      echo 'Checkout...'
      checkout scm
    }

    stage('Checking environment') {
      echo 'Checking environment...'
      sh 'source /etc/profile'
      sh 'git --version'
      sh 'docker -v'
      sh 'eksctl version'
    }
}