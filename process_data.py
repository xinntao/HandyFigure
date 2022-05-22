import yaml

with open('figures/database.yml', mode='r') as f:
    data = yaml.load(f, Loader=yaml.FullLoader)['figures']

# generate .js file for html
file_js = open('html/data/data.js', mode='w')
file_js.write('var data = [ \n')
for entry in data:
    title = entry['title']
    url_img = entry['url_img']
    url_paper = '#' if entry['url_paper'] is None else entry['url_paper']
    url_src = entry['url_src']
    url_project = '#' if entry['url_project'] is None else entry['url_project']
    data_string = '{\n' \
        f'    "title": "{title}",\n '\
        f'    "url_img": "{url_img}",\n '\
        f'    "url_paper": "{url_paper}",\n '\
        f'    "url_src": "{url_src}",\n '\
        f'    "url_project": "{url_project}",\n '\
         '},\n'
    file_js.write(data_string)

file_js.write(
    '];\n// repeat data for testing (uncomment the following line when depolying)\n//while (data.length < 100) data = data.concat(data);\n'
)
file_js.close()

# update .md file for README.md
with open('README.md', mode='rb') as f:
    ori_md = f.readlines()

ori_md_part1 = []
ori_md_part2 = []
flag_part1 = True
flag_part2 = False
for line in ori_md:
    if flag_part1 is True:
        ori_md_part1.append(line)

    if line == b'<!-- TBR -->\r\n':
        if flag_part1 is True:
            flag_part1 = False
        else:
            flag_part2 = True

    if flag_part2 is True:
        ori_md_part2.append(line)

file_md = open('README.md', mode='wb')
# part1
for line in ori_md_part1:
    file_md.write(line)
file_md.write(b'| Figure | Name | PPT Source| Paper |\n')
file_md.write(
    b'|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|\n'
)
for entry in data:
    title = entry['title']
    url_img = entry['url_img']
    url_paper = entry['url_paper']
    url_src = entry['url_src']
    url_project = '-' if entry['url_project'] is None else entry['url_project']
    if url_paper is None:
        data_string = f'| ![]({url_img}) | {title} | <{url_src}> | -|\n'
    else:
        data_string = f'| ![]({url_img}) | {title} | <{url_src}> | [Paper]({url_paper})|\n'
    file_md.write(str.encode(data_string))
# part2
for line in ori_md_part2:
    file_md.write(line)
file_md.close()
