/**
 * 将 File 对象转换为 Base64 字符串
 * @param {File} file - 要转换的文件对象
 * @returns {Promise<string>} Base64 编码的数据 URL
 */
export const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
})
