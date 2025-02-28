#!/bin/bash

# 音频批量转换脚本
# 将sounds目录下所有MP3文件转换为比特率128k，采样率24000Hz的格式

# 设置变量
SOURCE_DIR="./sounds"
TARGET_BITRATE="128k"
TARGET_SAMPLERATE="24000"
TEMP_DIR="./temp_audio"

# 确保ffmpeg已安装
if ! command -v ffmpeg &> /dev/null; then
    echo "错误: 未找到ffmpeg命令。请先安装ffmpeg。"
    echo "可以使用 'brew install ffmpeg' (Mac) 或 'apt-get install ffmpeg' (Linux) 安装。"
    exit 1
fi

# 创建临时目录
mkdir -p "$TEMP_DIR"

echo "开始转换音频文件..."
echo "目标比特率: $TARGET_BITRATE"
echo "目标采样率: $TARGET_SAMPLERATE Hz"

# 统一处理文件路径
cd $(dirname "$SOURCE_DIR")
SOURCE_NAME=$(basename "$SOURCE_DIR")

# 查找所有MP3文件并处理
find "./$SOURCE_NAME" -type f -name "*.mp3" | while read -r file; do
    # 确保文件路径以 ./sounds 开头
    normalized_file=${file#/}  # 移除可能的开头斜杠
    normalized_file=${normalized_file#./} # 移除可能的开头./
    normalized_file="./$normalized_file"  # 添加./前缀
    
    # 获取相对路径
    rel_path="${normalized_file#./$SOURCE_NAME/}"
    
    # 创建目标文件的目录结构
    target_dir="$TEMP_DIR/$(dirname "$rel_path")"
    mkdir -p "$target_dir"
    
    # 设置输出文件路径
    output_file="$TEMP_DIR/$rel_path"
    
    echo "处理: $normalized_file"
    
    # 使用ffmpeg转换文件，确保文件路径用引号包围
    ffmpeg -i "$normalized_file" -b:a $TARGET_BITRATE -ar $TARGET_SAMPLERATE -q:a 5 -map_metadata -1 -joint_stereo 1 -af "highpass=f=40, lowpass=f=15000" "$output_file"
    if [ $? -eq 0 ]; then
        echo "✓ 成功转换: $rel_path"
    else
        echo "✗ 转换失败: $rel_path"
    fi
done

# 回到原来的目录
cd - > /dev/null

echo "所有文件转换完成。"
echo "转换后的文件保存在临时目录: $TEMP_DIR"
echo

# 询问是否替换原文件
read -p "是否用转换后的文件替换原文件？(y/n): " replace_answer
if [[ "$replace_answer" =~ ^[Yy]$ ]]; then
    echo "正在替换原文件..."
    
    find "$TEMP_DIR" -type f -name "*.mp3" | while read -r file; do
        # 获取相对于临时目录的路径
        rel_path="${file#$TEMP_DIR/}"
        original_file="$SOURCE_DIR/$rel_path"
        
        # 替换原文件
        mv "$file" "$original_file"
        echo "已替换: $rel_path"
    done
    
    # 清理临时目录
    rm -rf "$TEMP_DIR"
    echo "原文件已替换完成！"
else
    echo "转换后的文件保留在临时目录: $TEMP_DIR"
    echo "您可以手动将其移动到所需位置。"
fi

echo "音频转换过程已完成。" 