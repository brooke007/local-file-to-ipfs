import { NFTStorage, File } from 'nft.storage'

import mime from 'mime'

import fs from 'fs'

import path from 'path'

const NFT_STORAGE_KEY = 'your NFT_STORAGE_KEY'


async function storeNFT(imagePath, name, description, framesdata) {
    const image = await fileFromPath(imagePath)
    const attributes = await fileFromPath(framesdata)

    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    return nftstorage.store({
        image,
        name,
        description,
        attributes,
    })
}

async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}

async function main() {
    const args = process.argv.slice(2)
    if (args.length !== 4) {
        console.error(`usage: ${process.argv[0]} ${process.argv[1]} <image-path> <name> <description> <framesdata>`)
        process.exit(1)
    }

    const [imagePath, name, description, framesdata] = args
    const result = await storeNFT(imagePath, name, description, framesdata)
    console.log(result)
}

// node upload.mjs token.png 'A name for my token' 'A longer description for the token...' all-keyframes.json dir
main()
  .catch(err => {
      console.error(err)
      process.exit(1)
  })
