<template>
  <div class="signature-canvas-wrapper">
    <canvas
      ref="canvasRef"
      class="signature-canvas"
      :width="width"
      :height="height"
      @mousedown="startDraw"
      @mousemove="draw"
      @mouseup="stopDraw"
      @mouseleave="stopDraw"
      @touchstart.prevent="startDrawTouch"
      @touchmove.prevent="drawTouch"
      @touchend="stopDraw"
    />
    <div class="signature-line" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = withDefaults(
  defineProps<{ width?: number; height?: number }>(),
  { width: 500, height: 200 }
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let drawing = false;

onMounted(() => {
  if (!canvasRef.value) return;
  ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
});

function getPos(e: MouseEvent) {
  const rect = canvasRef.value!.getBoundingClientRect();
  const scaleX = props.width / rect.width;
  const scaleY = props.height / rect.height;
  return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}

function getTouchPos(e: TouchEvent) {
  const rect = canvasRef.value!.getBoundingClientRect();
  const scaleX = props.width / rect.width;
  const scaleY = props.height / rect.height;
  const touch = e.touches[0]!;
  return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
}

function startDraw(e: MouseEvent) {
  if (!ctx) return;
  drawing = true;
  const { x, y } = getPos(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(e: MouseEvent) {
  if (!drawing || !ctx) return;
  const { x, y } = getPos(e);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function startDrawTouch(e: TouchEvent) {
  if (!ctx) return;
  drawing = true;
  const { x, y } = getTouchPos(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function drawTouch(e: TouchEvent) {
  if (!drawing || !ctx) return;
  const { x, y } = getTouchPos(e);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function stopDraw() {
  drawing = false;
}

function clear() {
  if (!ctx || !canvasRef.value) return;
  ctx.clearRect(0, 0, props.width, props.height);
}

function isEmpty(): boolean {
  if (!canvasRef.value) return true;
  const data = ctx?.getImageData(0, 0, props.width, props.height).data;
  return !data || !data.some((v) => v !== 0);
}

function toBlob(): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvasRef.value?.toBlob(resolve, 'image/png');
  });
}

defineExpose({ clear, isEmpty, toBlob });
</script>

<style scoped>
.signature-canvas-wrapper {
  position: relative;
  width: 100%;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
.signature-canvas {
  display: block;
  width: 100%;
  height: auto;
  cursor: crosshair;
  touch-action: none;
}
.signature-line {
  position: absolute;
  bottom: 36px;
  left: 16px;
  right: 16px;
  height: 1px;
  background: #bdbdbd;
  pointer-events: none;
}
</style>
