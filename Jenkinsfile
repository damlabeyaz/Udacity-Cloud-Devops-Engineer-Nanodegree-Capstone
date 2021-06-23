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
        steps {
            script {
                docker.image('hadolint/hadolint:latest-debian').inside() {
                        sh 'hadolint ./Dockerfile | tee -a hadolint_lint.txt'
                        sh '''
                            lintErrors=$(stat --printf="%s"  hadolint_lint.txt)
                            if [ "$lintErrors" -gt "0" ]; then
                                echo "Errors have been found, please see below"
                                cat hadolint_lint.txt
                                exit 1
                            else
                                echo "There are no erros found on Dockerfile!!"
                            fi
                        '''
                }
            }
        }
    }
}