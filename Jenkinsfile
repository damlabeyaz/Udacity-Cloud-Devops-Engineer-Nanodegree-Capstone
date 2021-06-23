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
}