import { readChunkOfFile } from '.'

const CHUNKSIZE = 1048576

/**
 * @description This method is more leightweight on memory when reading bigger files
 */
export const readFileInChunks = async (uri: string): Promise<string> => {
  let content = ''
  let chunk = ''
  let index = 0

  do {
    // eslint-disable-next-line no-await-in-loop
    chunk = await readChunkOfFile(uri, CHUNKSIZE, index * CHUNKSIZE)
    content += chunk
    index++
  } while (chunk.length)
  return content
}
