export const 词典数据 = {};
export const 词形变化数据 = {};

async function 导入数据() {
    for (var 文件序号 = 0; 文件序号 < 16; 文件序号++) {
        const 词典 = await import('./词典数据/词典' + 文件序号)
        var 数据 = 词典.数据
        for (var 英文 in 数据) {
            词典数据[英文] = 数据[英文];
        }
    }
}
let 词形变化源数据 = require('./词典数据/词形变化').数据
for (var 英文 in 词形变化源数据) {
    词形变化数据[英文] = 词形变化源数据[英文];
}

导入数据()