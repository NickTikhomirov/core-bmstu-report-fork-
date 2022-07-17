const { readConfig } = require('@md-to-latex/title/dist/config/config');
const fs = require('fs');
const {
    translit,
    getAbbreviation,
} = require('@md-to-latex/manager/dist/utils/filename');


function __format_name_array(inArray, defaultName){
    if (inArray.length === 0)
        return defaultName;
    return inArray.join('_');
}

function __get_filename(config){
    const authorString = translit(config.general.author.name).replace(
        /[ .]/g,
        '',
    );
    const year = ""+config.general.document.year;
    const topic = config.general.document.topic;

    if (config.title === undefined){
        return __format_name_array([authorString, topic, year]);
    }

    if(config.title.practice !== undefined){
        const practice = 'Practice';
        const course = "C"+config.title.practice.author.afterCourse;

        return __format_name_array([authorString, practice, course, year]);
    }

    if(config.title.report !== undefined){
        const groupString = translit(config.title.report.author.group);
        const subjectAbbreviation = getAbbreviation(
            config.title.report.document.subject,
        );
        const typeAbbreviation = getAbbreviation(
            config.title.report.document.typeDative,
        );

        return __format_name_array([authorString, groupString, subjectAbbreviation, typeAbbreviation]);
    }

    return "undefined"; // this code is expected to be unreachable
}

function __postbuild() {
    const config = readConfig('md-to-latex-title.yml');
    const filename = __get_filename(config) + '.pdf';
    fs.copyFileSync('out/index.pdf', filename);
}

module.exports = {
    postbuild: __postbuild,
};

if (require.main === module) {
    __postbuild();
}
