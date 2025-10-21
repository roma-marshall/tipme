import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TipMeModule", (m) => {
    // Разворачиваем контракт TipMe без аргументов конструктора
    const tipMe = m.contract("TipMe", []);

    // Экспортируем адрес и ссылку на инстанс, чтобы фронт мог использовать
    return { tipMe };
});
