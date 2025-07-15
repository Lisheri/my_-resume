import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPdf(element: HTMLElement, filename: string = '简历') {
  try {
    // 临时调整样式以优化PDF输出
    const originalStyle = {
      transform: element.style.transform,
      transformOrigin: element.style.transformOrigin,
      width: element.style.width,
      height: element.style.height
    }

    // 创建画布
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    })

    // 恢复原始样式
    Object.assign(element.style, originalStyle)

    // 获取画布尺寸
    const imgWidth = canvas.width
    const imgHeight = canvas.height

    // 计算PDF尺寸 (A4: 210 x 297 mm)
    const pdfWidth = 210
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth

    // 创建PDF
    const pdf = new jsPDF({
      orientation: pdfHeight > 297 ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // 如果内容高度超过一页，需要分页
    if (pdfHeight > 297) {
      let remainingHeight = pdfHeight
      let position = 0

      while (remainingHeight > 0) {
        const pageHeight = Math.min(297, remainingHeight)
        
        if (position > 0) {
          pdf.addPage()
        }

        // 计算当前页面在原图中的位置
        const sourceY = (position * imgHeight) / pdfHeight
        const sourceHeight = (pageHeight * imgHeight) / pdfHeight

        // 创建当前页面的画布
        const pageCanvas = document.createElement('canvas')
        const pageCtx = pageCanvas.getContext('2d')!
        
        pageCanvas.width = imgWidth
        pageCanvas.height = sourceHeight

        // 绘制当前页面内容
        pageCtx.drawImage(
          canvas,
          0, sourceY, imgWidth, sourceHeight,
          0, 0, imgWidth, sourceHeight
        )

        // 添加到PDF
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95)
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pageHeight)

        remainingHeight -= pageHeight
        position += pageHeight
      }
    } else {
      // 单页内容
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
    }

    // 下载PDF
    const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
    pdf.save(finalFilename)

  } catch (error) {
    console.error('PDF导出错误:', error)
    throw new Error('PDF导出失败')
  }
} 