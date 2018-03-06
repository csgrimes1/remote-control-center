const emit = (text) => {
    text.split('\n')
        .filter(line => line)
        .map(line => console.log(line.trimLeft().replace(/&&/g, '  &&'))) // eslint-disable-line
}
const workdir = '/usr/app'
const thinImage = process.env.THIN_IMAGE
const port = thinImage ? 3000 : 80

emit(`FROM node:8.9.4-stretch
    RUN  apt-get update \\
      && apt-get install -y nmap net-tools android-tools-adb android-tools-fastboot
    WORKDIR ${workdir}
    ENV SERVERPORT=${port}
    EXPOSE ${port}
`)

if (thinImage) {
    emit(`
        ENTRYPOINT ["/bin/bash"]
    `)
} else {
    emit(`#FULL image 
        COPY . ${workdir}
        RUN chmod 777 ${workdir} \\
          && npm install
        ENTRYPOINT ["node"]
        CMD ["src/index"]
    `)
}
