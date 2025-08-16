function safeCeilDiv(a: number, b: number) {
    return Math.ceil(a / b);
}

/**
 * Рисует сетку, выровненную по пиксельной сетке.
 * offsetX/offsetY — смещение в пикселях экрана (pan), scale — множитель (zoom).
 */
export function drawGrid(
    context: CanvasRenderingContext2D,
    scale: number,
    offsetX: number,
    offsetY: number,
    cellSize: number = 5,
    gridColor: string = "#ccc"
): void {
    const canvas = context.canvas;
    const width = canvas.width;
    const height = canvas.height;

    const step = cellSize * scale;
    if (step <= 0) return;

    context.save();
    context.fillStyle = gridColor;

    // Вертикальные линии: x = offsetX + k * step
    let kx = safeCeilDiv(-offsetX, step);
    for (let x = offsetX + kx * step; x <= width; x += step) {
        const xi = Math.round(x);
        // отрисовываем вертикальную линию 1px через fillRect для точного совмещения
        context.fillRect(xi, 0, 1, height);
    }

    // Горизонтальные линии: y = offsetY + k * step
    let ky = safeCeilDiv(-offsetY, step);
    for (let y = offsetY + ky * step; y <= height; y += step) {
        const yi = Math.round(y);
        context.fillRect(0, yi, width, 1);
    }

    context.restore();
}

/**
 * Рисует "пиксель" на виртуальной карте (mapX,mapY — координаты в клетках).
 * Использует ту же логику округления, что и drawGrid.
 */
export function drawPixel(
    context: CanvasRenderingContext2D,
    scale: number,
    offsetX: number,
    offsetY: number,
    mapX: number,
    mapY: number,
    cellSize: number = 5,
    color: string = "#000"
): void {
    const step = cellSize * scale;
    if (step <= 0) return;

    // Куда попадает верхний левый угол клетки на экране
    const sx = Math.round(mapX * step + offsetX);
    const sy = Math.round(mapY * step + offsetY);
    const size = Math.max(1, Math.round(step)); // минимум 1px

    context.fillStyle = color;
    context.fillRect(sx, sy, size, size);
}