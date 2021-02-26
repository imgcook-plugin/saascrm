/**
 * @name plugin example
 * @param option: { data, filePath, config }
 * - data: module and generate code Data
 * - filePath: Pull file storage directory
 * - config: cli config
 */
const fse = require('fs-extra');

const pluginHandler = async options => {
  let { data, filePath, config  } = options;
  console.log('options:::', options);


  let result = {
    errorList: []
  };
  if (!data) return { message: '参数不对' };
  const panelDisplay = data.code && data.code.panelDisplay || data.data.code.panelDisplay;

  if (!fse.existsSync(filePath)) {
    fse.mkdirSync(filePath);
  }

  try {
    let index = 0;
    for (const item of panelDisplay) {
      let value = item.panelValue;
      const { panelName } = item;
      let outputFilePath = `${filePath}/${panelName}`;
      if (item.directory) {
        outputFilePath = `${filePath}/${item.directory}/${panelName}`;
        if (panelName.endsWith('.tsx')) {
          outputFilePath = `${filePath}/${item.directory}/index.tsx`;
        }
        if (!fse.existsSync(`${filePath}/${item.directory}`)) {
          if (!fse.existsSync(`${filePath}/components`)) {
            fse.mkdirSync(`${filePath}/components`);
          }
          fse.mkdirSync(`${filePath}/${item.directory}`);
        }
      }
      await fse.writeFile(outputFilePath, value, 'utf8');
      index++;
    }
  } catch (error) {
    result.errorList.push(error);
  }

  return { data, filePath, config, result };
};

module.exports = (...args) => {
  return pluginHandler(...args).catch(err => {
    console.log(err);
  });
};
