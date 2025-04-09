// 工具函数定义在 Page 对象外部
function textToBinary(text) {
  return text.split('').map(char => char.codePointAt(0).toString(2).padStart(32, '0')).join('');
}

function binaryToVariationSelectors(binary) {
  const VARIATION_SELECTOR_15 = '\uFE0E'; // U+FE0E
  const VARIATION_SELECTOR_16 = '\uFE0F'; // U+FE0F
  return binary.split('').map(bit => bit === '0' ? VARIATION_SELECTOR_15 : VARIATION_SELECTOR_16).join('');
}

function variationSelectorsToBinary(variationSelectors) {
  const VARIATION_SELECTOR_15 = '\uFE0E'; // U+FE0E
  const VARIATION_SELECTOR_16 = '\uFE0F'; // U+FE0F
  return variationSelectors.split('').map(char => char === VARIATION_SELECTOR_15 ? '0' : '1').join('');
}

function binaryToText(binary) {
  return binary.match(/.{1,32}/g).map(byte => String.fromCodePoint(parseInt(byte, 2))).join('');
}

// Page 对象定义
Page({
data: {
  originalText: '',
  secretMessage: '',
  outputText: '',
  //SEPARATOR: '\u{1F340}' // 🌀 作为分隔符
  SEPARATOR: '\u{200D}' // 🌀 作为分隔符
},

onOriginalTextChange(e) {
  this.setData({
    originalText: e.detail.value
  });
  console.log("onoriginalTextChange originalText:", this.data.originalText);
},
//1233🍀︎️️️︎︎︎️︎️️️︎️️️︎️️︎︎️️︎︎️️︎︎︎︎️︎️️️︎︎️️︎️️︎︎️︎︎︎️️︎︎️️︎︎️️︎︎︎︎️︎️️️︎︎️️︎️️︎︎️︎︎︎️️︎︎️️︎︎️️︎︎︎︎️︎️️️︎︎️️︎️️︎︎️︎︎︎️️︎︎️️︎︎️️︎︎︎︎️︎️️️︎︎
onSecretMessageChange(e) {
  this.setData({
    secretMessage: e.detail.value
  });
  console.log("onSecretMessageChange secretMessage:", this.data.secretMessage);
},
onFullMessageChange(e) {
  this.setData({
    outputText: e.detail.value
  });
  console.log("onFullMessageChange outputText:", this.data.outputText);
},
down() {
  this.encodeMessage();
},
up() {
  this.decodeMessage();
},

encodeMessage() {
  let encodedMessage = '';
  const secretMessage = this.data.secretMessage;
  const binaryMessage = textToBinary(secretMessage);
  console.log("encodeMessage binaryMessage:", binaryMessage);
  console.log("encodeMessage binaryMessage length:", binaryMessage.length);
  // 获取 secretMessage 的长度并转换为 32 位二进制字符串
  const lengthBinary = secretMessage.length.toString(2).padStart(32, '0');
  console.log("encodeMessage lengthBinary:", lengthBinary);

  // 将长度信息添加到 binaryMessage 的开头
  const fullBinaryMessage = lengthBinary + binaryMessage;
  console.log("encodeMessage fullBinaryMessage:", fullBinaryMessage);
  console.log("encodeMessage fullBinaryMessage length:", fullBinaryMessage.length);
  const variationSelectors = binaryToVariationSelectors(fullBinaryMessage);
  console.log("encodeMessage variationSelectors:", variationSelectors);

  const encodedText = this.data.originalText + this.data.SEPARATOR + variationSelectors;
  console.log("encodeMessage encodedText:", encodedText);

  this.setData({
    outputText: encodedText
  });
},

decodeMessage() {
  const separatorIndex = this.data.outputText.indexOf(this.data.SEPARATOR);
  if (separatorIndex !== -1) {
    const extractedVariationSelectors = this.data.outputText.slice(separatorIndex + this.data.SEPARATOR.length);
    console.log("decodeMessage extractedVariationSelectors:", extractedVariationSelectors);

    const extractedBinary = variationSelectorsToBinary(extractedVariationSelectors);
    console.log("decodeMessage extractedBinary:", extractedBinary);
    console.log("decodeMessage extractedBinary length:", extractedBinary.length);
    // 提取长度信息（前 32 位）
    const lengthBinary = extractedBinary.slice(0, 32);
    console.log("decodeMessage lengthBinary:", lengthBinary);

    // 将长度信息从二进制转换为十进制
    const length = parseInt(lengthBinary, 2);
    console.log("decodeMessage length:", length);

    // 提取隐藏的 binaryMessage（去掉前 32 位）
    const binaryMessage = extractedBinary.slice(32, length * 32 + 32);
    console.log("decodeMessage binaryMessage:", binaryMessage);
    console.log("decodeMessage binaryMessage length:", binaryMessage.length);
  
    // 确保 binaryMessage 的长度符合预期
    if (binaryMessage.length !== length * 32) {
      console.log("decodeMessage: binaryMessage length mismatch.");
      return;
    }

    const extractedMessage = binaryToText(binaryMessage);
    console.log("decodeMessage secretMessage:", extractedMessage);

    this.setData({
      secretMessage: extractedMessage
    });
  } else {
    console.log("Separator not found.");
  }
},
copyText: function() {
  const textToCopy = this.data.outputText;
  wx.setClipboardData({
    data: textToCopy,
    success: function(res) {
      wx.showToast({
        title: '复制成功',
        icon: 'success',
        duration: 2000
      });
    },
    fail: function(res) {
      wx.showToast({
        title: '复制失败',
        icon: 'none',
        duration: 2000
      });
    }
  });
},
pasteText: function() {
  /*const that = this;
  wx.getClipboardData({
    success: function(res) {
      that.setData({
        outputText: res.data
      });
      wx.showToast({
        title: '粘贴成功',
        icon: 'success',
        duration: 2000
      });
    },
    fail: function(res) {
      wx.showToast({
        title: '粘贴失败',
        icon: 'none',
        duration: 2000
      });
    }
  });*/
  // 声明 class
  /*const AV = require("../../libs/av-core-min.js");
  const Todo = AV.Object.extend("test1");

  // 构建对象
  const todo = new Todo();
  console.log(`保存成功。objectId：${todo}`);
  // 为属性赋值
  todo.set("title", "工程师周会");
  todo.set("content", "周二两点，全体成员");

  // 将对象保存到云端
  todo.save().then(
    (todo) => {
      // 成功保存之后，执行其他逻辑
      console.log(`保存成功。objectId：${todo.id}`);
    },
    (error) => {
      console.log(`保存shibai。objectId：${todo.id}`);
      // 异常处理
    }
  );*/
  // 基本类型
  const bool = true;
  const number = 2019;
  const string = `${number} 流行音乐榜单`;
  const date = new Date();
  const array = [string, number];
  const object = {
    number: number,
    string: string,
  };

  // 构建对象
  const AV = require("../../libs/av-core-min.js");
  const TestObject = AV.Object.extend("TestObject");
  const testObject = new TestObject();
  testObject.set("testNumber", number);
  testObject.set("testString", string);
  testObject.set("testDate", date);
  testObject.set("testArray", array);
  testObject.set("testObject", object);
  testObject.save();
  }
});