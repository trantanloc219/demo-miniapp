import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // Tắt Rolldown hoàn toàn, ép Vite quay lại Rollup
        rollupOptions: {},

        // (Tuỳ chọn) tối ưu build output
        // outDir: 'dist',
        sourcemap: false,
    },
})
