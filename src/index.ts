import {ExtensionContext, commands, sources, workspace, listManager} from 'coc.nvim'
import fs from 'fs'
import BibTeXList from './list'
import BibTexSource from './complete'
import cacheFullFilePaths from './cacheFullFilePaths'
import BibTeXReader from './BibTexReader'
import CacheInterface from './CacheInterface'

export async function activate(context: ExtensionContext) {
  const {subscriptions} = context
  const config = workspace.getConfiguration('lists')
  const disabled = config.get('disabledLists', [])
  const {nvim} = workspace

  function isDisabled(name:string): boolean {
    return disabled.indexOf(name) !== -1
  }

  async function updateCache(): Promise<void> {
    const files = await cacheFullFilePaths()
    files.forEach(file => {
      const cacheFile = CacheInterface.cacheFilePath(file)
      if (fs.existsSync(cacheFile)) return
      workspace.showMessage(`Caching BibTeX file ${file}, one moment…`)
      const task = new BibTeXReader(file)
      task.on('data', () => {})
      task.on('end', () => {
        workspace.showMessage('Done')
        setTimeout(() => nvim.command('echom ""'), 500)
      })
    })
  }

  if (!isDisabled('bibtex')) {
    await updateCache()
    subscriptions.push(commands.registerCommand('bibtex.reloadLibrary', updateCache))
    subscriptions.push(listManager.registerList(new BibTeXList(nvim)))
    subscriptions.push(sources.createSource(BibTexSource))
  }
}
