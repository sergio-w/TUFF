import os

directory_path = os.getcwd()

def count_folders(directory):
    return sum(1 for entry in os.scandir(directory) if entry.is_dir())

def get_folder_name_by_index(directory, index):
    folders = [entry.name for entry in os.scandir(directory) if entry.is_dir()]
    if 0 <= index < len(folders):
        return folders[index]
    else:
        return "Index out of range"

folder_count = sum(1 for entry in os.scandir(directory_path) if entry.is_dir())

for i in range(folder_count):
    try:
        folder = os.path.join(directory_path, get_folder_name_by_index(directory_path, i))
        index_file = os.path.join(folder, "index.html")
        
        if os.path.exists(index_file):
            with open(index_file, "r+", encoding="utf-8") as file:
                lines = file.readlines()
                
                for line_num, line in enumerate(lines):
                    if line.strip().startswith("<head>"): #and not any(line.strip() == '<link rel="shortcut icon" id="favi" href="">' for line in lines[line_num + 1:]):
                        # this is just for the title
                        if not any(line.strip() == '<link rel="shortcut icon" id="favi" href="">' for line in lines[line_num + 1:]):
                            lines.insert(line_num + 1, '<link rel="shortcut icon" id="favi" href="">\n')
                        #this is for the analytics. if you want me to remove em you can just set the <script> part to ""
                        if not any(line.strip() == '<script async src="https://www.googletagmanager.com/gtag/js?id=G-KW15Q1QG97"></script>' for line in lines[line_num + 1:]):
                            lines.insert(line_num + 2, '<script async src="https://www.googletagmanager.com/gtag/js?id=G-KW15Q1QG97"></script>\n')
                        # this is for the accuall loading data and also the script that starts the analytics i think..
                        if not any(line.strip() == '<script type="text/javascript" src="/assets/js/LoadData.js"></script>' for line in lines[line_num + 1:]):
                            lines.insert(line_num + 3, '<script type="text/javascript" src="/assets/js/LoadData.js"></script>\n')
                        break
                    
                    if line.strip().startswith("<title>"):
                        lines[line_num] = ""
            
            with open(index_file, "w", encoding="utf-8") as file:
                file.writelines(lines)
        else:
            print(f"index.html not found in folder: {folder}")

    except IOError as e:
        print(f"Problem reading or writing: {index_file}, Error: {e}")
