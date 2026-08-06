import glob

files = glob.glob('src/app/*/page.tsx')
for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Check if currency is already added
    if 'currency: "QAR",' not in content:
        content = content.replace('doctype: "Sale Bill",', 'doctype: "Sale Bill",\n      currency: "QAR",')
        content = content.replace('doctype: "POS Invoice",', 'doctype: "POS Invoice",\n      currency: "QAR",')
        
        with open(f, 'w') as file:
            file.write(content)
        print(f"Updated {f}")
