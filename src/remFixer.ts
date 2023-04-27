const computed = (remSize:number, designW:number, designH:number) => {
  const scale = Math.min(  window.innerHeight/designH)
  window.document.documentElement.style.fontSize = scale * remSize + "px"
}

export default function remFixer(remSize = 20, designW = 1920, designH = 1080, cf = computed) {
  cf(remSize, designW, designH)
  window.addEventListener('resize', () => cf(remSize, designW, designH))
}