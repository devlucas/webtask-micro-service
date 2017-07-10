import NodeExternals from 'webpack-node-externals'
import Path from 'path'

const webtaskName = 'webtask-micro-service'
const resolve = target => Path.resolve(__dirname, `${target}`)

export default () => {
  return {
    entry: resolve(`${webtaskName}.js`),
    externals: [NodeExternals()],
    output: {
      filename: `${webtaskName}.js`,
      path: resolve('dist'),
      library: webtaskName,
      libraryTarget: 'commonjs2'
    }
  }
}
