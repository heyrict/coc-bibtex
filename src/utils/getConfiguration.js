import { workspace } from 'coc.nvim';
import packageJson from '../../package.json';
const getConfigurationDefault = key => packageJson.contributes.configuration.properties[key].default;
const getConfiguration = async () => {
  const bibtexConfig = await workspace.getConfiguration('bibtex');
  const listConfig = await workspace.getConfiguration('list.source.bibtex');
  const completeConfig = await workspace.getConfiguration('coc.source.bibtex');
  if (Object.prototype.hasOwnProperty.call(listConfig, 'files')) {
    workspace.showMessage('Deprecation Warning: "list.source.bibtex.files" has been replaced with "bibtex.files". Please update your configuration settings.');
  }
  return Object.assign({
    enable: getConfigurationDefault('bibtex.enable'),
    files: getConfigurationDefault('bibtex.files'),
    citation: getConfigurationDefault('list.source.bibtex.citation'),
    shortcut: getConfigurationDefault('coc.source.bibtex.shortcut'),
    triggerCharacters: getConfigurationDefault('coc.source.bibtex.triggerCharacters'),
    triggerPatterns: getConfigurationDefault('coc.source.bibtex.triggerPatterns'),
    fileTypes: getConfigurationDefault('coc.source.bibtex.filetypes')
  }, listConfig, completeConfig, bibtexConfig);
};

export default getConfiguration;
