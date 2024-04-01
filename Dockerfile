FROM harbor.com/repository/tests/tests_base_image:latest
COPY ./cypress /cypress
WORKDIR /cypress
ENV spec='cypress/e2e/*'
ENTRYPOINT npx cypress run --browser chrome --spec ${spec}