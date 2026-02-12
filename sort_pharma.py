#!/usr/bin/env python3
import re

PINYIN_ORDER = [
    "阿斯利康(仿制)", "艾伯维(仿制)", "艾迪药业", "百奥泰", "百济神州", "百克生物", "拜耳(仿制)",
    "北京生物制品所", "北京同仁堂", "北海康成", "白云山", "长春百克", "成都倍特", "成都地奥",
    "成都生物制品所", "成都蓉生", "成都九芝堂", "成大生物", "传奇生物", "复旦张江", "复宏汉霖",
    "歌礼药业", "甘李药业", "广东东阳光", "广州白云山", "广州白云山中一", "国健呈诺", "国药集团",
    "海正药业", "合肥天麦", "和记黄埔医药", "和黄医药", "恒瑞医药", "华兰生物", "基石药业",
    "吉利德(仿制)", "吉立亚(仿制)", "济民可信", "江苏万邦", "江苏苏中药业", "九芝堂", "君实生物",
    "凯因科技", "康方生物", "康华生物", "康宁杰瑞", "康泰生物", "科兴生物", "科济药业",
    "丽珠集团", "丽珠医药", "涟水制药", "罗氏(仿制)", "默沙东(仿制)", "诺华(仿制)", "齐鲁制药",
    "辉瑞(仿制)", "上海第一生化", "上海莱士", "上海雷允上", "上海中西药业", "上海和黄药业",
    "神州细胞", "神威药业", "石药集团", "苏州雷允上", "天坛生物", "天士力", "通化东宝",
    "药明巨诺", "万泰生物", "沃森生物", "武汉生物制品所", "武汉中联", "宜昌东阳光", "泽璟制药",
    "正大天晴", "珠海联邦", "智飞生物", "郑州莱士", "香雪制药", "医科院生物所", "以岭药业",
    "远大蜀阳", "云南白药", "云南植物药业", "漳州片仔癀", "浙江海正", "正大青春宝", "山东泰邦",
    "山东沃华", "山西德元堂", "深圳科兴", "驯鹿生物", "合源生物", "东阳光药", "同仁堂",
    "太极集团", "仲景宛西制药", "宁波中药", "南京金陵药业", "雅安三九", "广西梧州制药", "博雅生物",
    "香港念慈庵", "天津中新药业", "白云山"
]

pinyin_sort_index = {name: idx for idx, name in enumerate(PINYIN_ORDER)}

def get_sort_key(name):
    if name in pinyin_sort_index:
        return (0, pinyin_sort_index[name])
    return (1, name)

def sort_table_rows(tbody_content):
    tr_pattern = re.compile(r'<tr>(.*?)</tr>', re.DOTALL)
    company_pattern = re.compile(r'<td class="company">(.*?)</td>')

    trs = tr_pattern.findall(tbody_content)
    
    def sort_key(tr):
        match = company_pattern.search(tr)
        if match:
            return get_sort_key(match.group(1))
        return (1, '')
    
    sorted_trs = sorted(trs, key=sort_key)
    
    sorted_content = ''
    for tr in sorted_trs:
        sorted_content += '<tr>' + tr + '</tr>'
    
    return sorted_content

def main():
    with open('/Users/junjunyi/src-code/flearn/doctor-tutorial/pharma-export.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    tbody_pattern = re.compile(r'(<tbody>)(.*?)(</tbody>)', re.DOTALL)
    
    def replace_tbody(match):
        opening = match.group(1)
        tbody = match.group(2)
        closing = match.group(3)
        sorted_tbody = sort_table_rows(tbody)
        return opening + sorted_tbody + closing
    
    new_content = tbody_pattern.sub(replace_tbody, content)
    
    with open('/Users/junjunyi/src-code/flearn/doctor-tutorial/pharma-export.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully sorted all tables by manufacturer name (pinyin order)")

if __name__ == '__main__':
    main()
