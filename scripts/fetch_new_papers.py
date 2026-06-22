#!/usr/bin/env python3
"""
Auto-fetch rolling-related papers and update papers.js
Sources: arXiv / Crossref / OpenAlex
"""
import sys, os, json, re, time, urllib.request, urllib.parse, datetime, traceback

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# ====== Config ======
DAYS_BACK = 7  # 只搜最近一周的论文
MAX_PER_DIR = 0  # 0 = 不删除旧论文，往期归档保留
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PAPERS_JS = os.path.join(os.path.dirname(SCRIPT_DIR), "papers.js")

DIRECTIONS = [
    {"id": "ml", "name": "机器学习与智能预测", "keywords": ["machine learning", "deep learning", "neural network", "reinforcement learning", "data-driven", "artificial intelligence", "LSTM", "CNN", "GAN", "transformer", "random forest", "XGBoost", "gradient boosting", "prediction model"]},
    {"id": "constitutive", "name": "本构模型与流变应力", "keywords": ["constitutive model", "flow stress", "rheology", "strain rate", "hot deformation", "dynamic recrystallization", "activation energy", "Zener-Hollomon", "Johnson-Cook", "Arrhenius"]},
    {"id": "fem", "name": "有限元与多物理场仿真", "keywords": ["finite element", "FEM", "simulation", "numerical modeling", "ABAQUS", "ANSYS", "DEFORM", "Simufact", "multi-physics", "coupled simulation"]},
    {"id": "control", "name": "智能控制与AGC", "keywords": ["automatic gauge control", "AGC", "PID control", "model predictive control", "adaptive control", "hydraulic", "looper control", "tension control", "thickness control", "flatness control", "robust control"]},
    {"id": "digital", "name": "数字孪生与在线监测", "keywords": ["digital twin", "online monitoring", "fault diagnosis", "condition monitoring", "predictive maintenance", "sensor", "real-time", "anomaly detection"]},
    {"id": "micro", "name": "组织演变与性能调控", "keywords": ["microstructure", "phase transformation", "recrystallization", "precipitation", "texture", "grain refinement", "annealing", "EBSD", "mechanical properties", "tensile", "hardness", "ductility"]},
    {"id": "process", "name": "工艺优化与参数设计", "keywords": ["process optimization", "rolling parameter", "rolling force", "rolling schedule", "deformation", "process design", "rolling mill", "work roll", "roll gap", "reduction ratio"]},
    {"id": "clad", "name": "复合轧制与层压材料", "keywords": ["clad", "composite", "laminated", "bimetal", "multilayer", "bonding", "interface", "roll bonding", "accumulative roll bonding", "ARB"]},
    {"id": "tribo", "name": "摩擦润滑与磨损", "keywords": ["friction", "lubrication", "wear", "tribology", "tribological", "lubricant", "surface roughness", "oxide scale", "friction coefficient"]},
    {"id": "green", "name": "绿色制造与节能减排", "keywords": ["recycling", "energy saving", "sustainable", "carbon emission", "CO2 reduction", "green manufacturing", "solid-state recycling", "energy consumption"]},
]

PROCESS_KEYWORDS = {
    "hot": ["hot rolling", "hot-rolled", "hot strip", "hot mill", "finish rolling", "reheating", "slab"],
    "cold": ["cold rolling", "cold-rolled", "cold strip", "cold mill", "skin pass", "temper rolling"],
    "warm": ["warm rolling", "warm-rolled", "cryogenic"],
    "asym": ["asymmetric rolling", "skew rolling", "planetary rolling", "cross wedge", "accumulative roll"],
    "tube": ["tube", "pipe", "hollow", "mandrel", "piercing", "seamless", "pilger"],
    "section": ["section", "shape", "beam", "bar", "wire", "rod", "rail", "profile"],
    "clad": ["clad", "composite", "bimetal", "laminated", "multilayer", "bonding", "sandwich"],
    "general": [],
}

EXCLUDE_KEYWORDS = [
    "rolling stock", "rolling stone", "rolling motion", "rolling hills", "rolling shutter",
    "rolling forecast", "rolling window", "rolling regression", "rolling average",
    "rolling hash", "rock and roll", "rolling luggage", "rolling backpack",
    "rolling code", "rolling restart", "kubernetes", "rolling deployment",
    "rolling basis", "rolling year", "rolling 12", "rolling 6", "rolling 3",
    "rolling sum", "rolling mean", "rolling median", "rolling correlation",
    "rolling volatility", "rolling beta", "rolling sharpe", "rolling return",
    "rolling estimate", "rolling horizon", "rolling plan",
    "infant model", "cipher", "axion", "inflation", "gravitational wave",
    "dark energy", "dark matter", "quantum", "cosmolog",
    "supply chain", "citrus", "asylum", "electrolyzer",
    "pedipulation", "data market", "active learning",
    "peer review", "llm", "language model", "conformal prediction",
    "random walk", "exchange rate", "asylum application",
    "airp", "bologna", "cruiser doctrine", "pre-war",
    "functional time series", "magneto-thermal",
    "training dynamic", "gpt", "chatbot",
    # 非金属轧制的 rolling 语境
    "rolling bearing", "rolling element bearing", "bearing fault", "bearing diagnosis",
    "rolling friction", "rolling contact", "rolling resistance",
    "ball mill", "ball milling", "high-energy ball",
    "magnetic bearing", "active magnetic bearing",
    "rolling tire", "rolling wheel", "rolling robot",
    "crawler", "treadmill", "track treadmill",
    "hydrogen storage", "mgh2",
    "nanotribology", "colloidal probe",
    "particle-laden", "clogging of pore",
    "sperm", "flagellar", "ciliary",
    "rolling sphere", "rolling ball", "rolling droplet",
]

# 必须包含 metal rolling 特定术语
ROLLING_REQUIRED = [
    "rolling mill", "rolling process", "rolling mill", "hot rolling", "cold rolling",
    "warm rolling", "roll gap", "roll force", "roll torque", "work roll",
    "backup roll", "roll bite", "strip rolling", "plate rolling",
    "foil rolling", "bar rolling", "wire rolling", "tube rolling",
    "pipe rolling", "shape rolling", "section rolling",
    "roll bonding", "roll cladding", "sendzimir", "tandem mill",
    "reversing mill", "steckel", "planetary rolling", "skew rolling",
    "cross wedge rolling", "pilger", "accumulative roll",
    "asymmetric rolling", "skin pass", "temper rolling",
    "flatness control", "crown control", "shape control rolling",
    "gauge control", "agc", "looper", "coiler",
    "reheating furnace", "hot strip mill", "cold strip mill",
    "rolling schedule", "reduction ratio", "roll deformation",
    "rolling reduction", "rolling pass", "rolling texture",
    "rolled strip", "rolled sheet", "rolled plate", "rolled bar",
    "rolled wire", "rolled tube", "rolled coil",
    "thin slab", "twin roll", "roll caster",
    "electrode rolling", "battery electrode roll",
    "roll wear", "roll thermal", "roll contour",
    "rolling friction mill", "mill load", "mill modulus",
]


def http_get(url, timeout=30, retries=2):
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (academic research)"})
            resp = urllib.request.urlopen(req, timeout=timeout)
            return resp.read().decode("utf-8", errors="replace")
        except Exception as e:
            if attempt < retries:
                time.sleep(3)
            else:
                print(f"  HTTP error: {e}", file=sys.stderr)
                return None
    return None


def fetch_arxiv():
    print("[arXiv] Fetching...")
    papers = []
    query = '(all:"rolling mill" OR all:"hot rolling" OR all:"cold rolling" OR all:"roll bonding" OR all:"rolling process" OR all:"strip rolling")'
    url = f"http://export.arxiv.org/api/query?search_query={urllib.parse.quote(query)}&start=0&max_results=80&sortBy=submittedDate&sortOrder=descending"
    data = http_get(url)
    if not data:
        return papers
    entries = re.findall(r"<entry>(.*?)</entry>", data, re.DOTALL)
    for entry in entries:
        try:
            title_m = re.search(r"<title>(.*?)</title>", entry, re.DOTALL)
            if not title_m:
                continue
            title = re.sub(r"\s+", " ", title_m.group(1)).strip()
            summary_m = re.search(r"<summary>(.*?)</summary>", entry, re.DOTALL)
            abstract = re.sub(r"\s+", " ", summary_m.group(1)).strip() if summary_m else ""
            published_m = re.search(r"<published>(.*?)</published>", entry)
            pub_date = published_m.group(1)[:10] if published_m else ""
            arxiv_m = re.search(r"<id>(.*?)</id>", entry)
            doi = f"arXiv:{arxiv_m.group(1).split('/')[-1]}" if arxiv_m else ""
            authors = re.findall(r"<name>(.*?)</name>", entry)
            authors_str = ", ".join(authors[:4]) + (" et al." if len(authors) > 4 else "")
            if pub_date:
                pub_dt = datetime.datetime.fromisoformat(pub_date)
                cutoff = datetime.datetime.now() - datetime.timedelta(days=DAYS_BACK)
                if pub_dt < cutoff:
                    continue
            papers.append({"title": title, "abstract": abstract, "authors": authors_str, "journal": "arXiv preprint", "sourceType": "预印本", "year": int(pub_date[:4]) if pub_date else datetime.datetime.now().year, "month": int(pub_date[5:7]) if pub_date and pub_date[5:7] else datetime.datetime.now().month, "doi": doi})
        except:
            continue
    print(f"  Got {len(papers)} from arXiv")
    return papers


def fetch_crossref():
    print("[Crossref] Fetching...")
    papers = []
    from_date = (datetime.datetime.now() - datetime.timedelta(days=DAYS_BACK)).strftime("%Y-%m-%d")
    queries = ["rolling mill", "hot rolling steel", "cold rolling strip", "roll bonding clad"]
    for q in queries:
        url = f"https://api.crossref.org/works?query={urllib.parse.quote(q)}&filter=from-created-date:{from_date},type:journal-article&rows=30&select=title,abstract,author,published,DOI,container-title"
        data = http_get(url)
        if not data:
            continue
        try:
            obj = json.loads(data)
            for item in obj.get("message", {}).get("items", []):
                title = item.get("title", [""])[0] if item.get("title") else ""
                if not title:
                    continue
                abstract = item.get("abstract", "")
                if abstract:
                    abstract = re.sub(r"<[^>]+>", "", abstract)
                    abstract = re.sub(r"\s+", " ", abstract).strip()
                authors_list = item.get("author", [])
                authors = []
                for a in authors_list[:4]:
                    name = (a.get("given", "") + " " + a.get("family", "")).strip()
                    if name:
                        authors.append(name)
                authors_str = ", ".join(authors) + (" et al." if len(authors_list) > 4 else "")
                journal = item.get("container-title", [""])[0] if item.get("container-title") else "Unknown"
                doi = item.get("DOI", "")
                date_parts = item.get("published-print", item.get("published-online", {})).get("date-parts", [[None]])
                year = date_parts[0][0] if date_parts and date_parts[0] else None
                month = date_parts[0][1] if date_parts and len(date_parts[0]) > 1 else 1
                if not year:
                    continue
                papers.append({"title": title, "abstract": abstract or "", "authors": authors_str, "journal": journal, "sourceType": "SCI", "year": int(year), "month": int(month), "doi": doi})
        except Exception as e:
            print(f"  Crossref error: {e}", file=sys.stderr)
        time.sleep(1)
    print(f"  Got {len(papers)} from Crossref")
    return papers


def fetch_openalex():
    print("[OpenAlex] Fetching...")
    papers = []
    from_date = (datetime.datetime.now() - datetime.timedelta(days=DAYS_BACK)).strftime("%Y-%m-%d")
    search_terms = ["rolling mill process", "hot rolling steel mill", "cold rolling strip mill", "roll bonding clad composite"]
    for term in search_terms:
        params = urllib.parse.urlencode({"search": term, "filter": f"from_publication_date:{from_date},type:article", "per_page": 30, "sort": "publication_date:desc"})
        url = f"https://api.openalex.org/works?{params}"
        data = http_get(url)
        if not data:
            continue
        try:
            obj = json.loads(data)
            for r in obj.get("results", []):
                title = r.get("title", "")
                if not title:
                    continue
                inv_idx = r.get("abstract_inverted_index", {})
                abstract = ""
                if inv_idx:
                    max_pos = 0
                    for positions in inv_idx.values():
                        for pos in positions:
                            max_pos = max(max_pos, pos)
                    words = [""] * (max_pos + 1)
                    for word, positions in inv_idx.items():
                        for pos in positions:
                            words[pos] = word
                    abstract = " ".join(words)
                authors_list = r.get("authorships", [])
                authors = []
                for a in authors_list[:4]:
                    name = a.get("author", {}).get("display_name", "")
                    if name:
                        authors.append(name)
                authors_str = ", ".join(authors) + (" et al." if len(authors_list) > 4 else "")
                venue = r.get("primary_location", {}).get("source", {})
                journal = venue.get("display_name", "Unknown") if venue else "Unknown"
                doi = r.get("doi", "") or ""
                if doi and doi.startswith("https://doi.org/"):
                    doi = doi.replace("https://doi.org/", "")
                pub_date = r.get("publication_date", "")
                year = int(pub_date[:4]) if pub_date[:4] else datetime.datetime.now().year
                month = int(pub_date[5:7]) if pub_date[5:7] else 1
                papers.append({"title": title, "abstract": abstract, "authors": authors_str, "journal": journal, "sourceType": "SCI", "year": year, "month": month, "doi": doi})
        except Exception as e:
            print(f"  OpenAlex error: {e}", file=sys.stderr)
        time.sleep(1)
    print(f"  Got {len(papers)} from OpenAlex")
    return papers


def is_rolling_related(paper):
    text = (paper.get("title", "") + " " + paper.get("abstract", "")).lower()
    for ex in EXCLUDE_KEYWORDS:
        if ex in text:
            return False
    for kw in ROLLING_REQUIRED:
        if kw in text:
            return True
    return False


def classify_direction(paper):
    text = (paper.get("title", "") + " " + paper.get("abstract", "")).lower()
    scores = {}
    for d in DIRECTIONS:
        score = 0
        for kw in d["keywords"]:
            score += text.count(kw.lower())
        scores[d["id"]] = score
    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return "process"
    return best


def classify_process(paper):
    text = (paper.get("title", "") + " " + paper.get("abstract", "")).lower()
    scores = {}
    for pt, keywords in PROCESS_KEYWORDS.items():
        score = sum(text.count(kw.lower()) for kw in keywords)
        scores[pt] = score
    best = max(scores, key=scores.get)
    if scores.get(best, 0) == 0:
        return "general"
    return best


def translate_text(text, sl="en", tl="zh-CN"):
    if not text or len(text) < 5:
        return text or ""
    if len(text) > 1800:
        text = text[:1800]
    url = "https://translate.googleapis.com/translate_a/single"
    params = {"client": "gtx", "sl": sl, "tl": tl, "dt": "t", "q": text}
    full_url = url + "?" + urllib.parse.urlencode(params)
    try:
        data = http_get(full_url, timeout=15)
        if not data:
            return text
        result = json.loads(data)
        translated = ""
        for sentence in result[0]:
            if sentence[0]:
                translated += sentence[0]
        return translated.strip()
    except:
        return text


def translate_long_text(text):
    if not text or len(text) <= 800:
        return translate_text(text)
    sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z])", text)
    chunks = []
    current = ""
    for s in sentences:
        if len(current) + len(s) + 1 <= 800:
            current = (current + " " + s).strip() if current else s
        else:
            if current:
                chunks.append(current)
            current = s
    if current:
        chunks.append(current)
    result = ""
    for chunk in chunks:
        translated = translate_text(chunk)
        if translated:
            result += translated
        time.sleep(0.3)
    return result


def generate_formula(title, abstract, direction, process_type):
    text = (title + " " + abstract).lower()
    tech_keywords = {
        "深度Q网络(DQN)": ["deep q-network", "dqn", "reinforcement learning"],
        "强化学习": ["reinforcement learning", "rl agent"],
        "CNN": ["cnn", "convolutional neural"],
        "LSTM/BiLSTM": ["lstm", "bilstm"],
        "Transformer": ["transformer", "attention mechanism"],
        "GAN": ["generative adversarial", "gan "],
        "随机森林": ["random forest"],
        "XGBoost": ["xgboost"],
        "LightGBM": ["lightgbm"],
        "遗传算法": ["genetic algorithm"],
        "粒子群(PSO)": ["particle swarm", "pso"],
        "鲸鱼算法(WOA)": ["whale optimization", "woa"],
        "麻雀搜索(SSA)": ["sparrow search", "ssa"],
        "支持向量机(SVM)": ["support vector", "svm"],
        "有限元(FEM)": ["finite element", "fem ", "fe simulation"],
        "ABAQUS": ["abaqus"],
        "DEFORM": ["deform"],
        "Simufact": ["simufact"],
        "晶体塑性": ["crystal plasticity"],
        "PID控制": ["pid control", "pid controller"],
        "AGC": ["automatic gauge control", "agc"],
        "模型预测控制(MPC)": ["model predictive control", "mpc"],
        "自适应控制": ["adaptive control"],
        "滑模控制(SMC)": ["sliding mode"],
        "数字孪生": ["digital twin"],
        "多传感器融合": ["multi-sensor", "sensor fusion", "data fusion"],
        "计算机视觉": ["computer vision", "image processing"],
        "相变控制": ["phase transformation", "phase transition"],
        "析出强化": ["precipitation", "precipitate"],
        "织构调控": ["texture", "crystallographic texture"],
        "再结晶": ["recrystallization"],
        "退火工艺": ["annealing"],
        "辊型优化": ["roll profile", "roll contour", "crown control"],
        "异步轧制": ["asymmetric rolling"],
        "楔横轧": ["cross wedge", "cwr"],
        "斜轧": ["skew rolling"],
        "累积叠轧(ARB)": ["accumulative roll bonding", "arb"],
        "轧制复合": ["roll bonding", "roll cladding"],
        "纳米润滑剂": ["nano-lubricant", "nanoparticle lubricant", "gnp"],
        "玻璃润滑": ["glass lubricant"],
        "磨损分析": ["wear", "abrasive wear"],
        "固态回收": ["solid-state recycling"],
        "电脉冲处理": ["electro-pulse", "electroplastic"],
        "球磨": ["ball milling", "high-energy milling"],
    }
    result_keywords = {
        "翘曲预测": ["warp", "warping", "buckling"],
        "板形控制": ["flatness", "shape control", "profile control"],
        "厚度精度": ["thickness", "gauge", "precision"],
        "缺陷检测": ["defect detection", "surface defect"],
        "故障诊断": ["fault diagnosis", "fault detection"],
        "寿命预测": ["remaining useful", "life prediction", "rul"],
        "振动抑制": ["vibration", "damping"],
        "调度优化": ["scheduling", "dispatch"],
        "强塑性协同": ["strength-ductility"],
        "界面结合": ["interface", "bonding strength"],
        "润滑性能": ["lubrication", "friction coefficient"],
        "耐磨性": ["wear resistance"],
        "组织调控": ["microstructure", "grain refinement"],
        "工艺优化": ["optimization", "parameter optimization"],
        "控制策略": ["control strategy", "control method"],
        "性能预测": ["prediction", "forecast"],
    }
    found_tech = []
    for tech, kws in tech_keywords.items():
        for kw in kws:
            if kw in text:
                found_tech.append(tech)
                break
        if len(found_tech) >= 3:
            break
    dir_names = {d["id"]: d["name"].split("&")[0] for d in DIRECTIONS}
    if direction in dir_names and dir_names[direction] not in found_tech:
        found_tech.append(dir_names[direction])
    process_names = {"hot": "热轧工艺", "cold": "冷轧工艺", "warm": "温轧工艺", "asym": "异步轧制", "tube": "管材轧制", "section": "型线轧制", "clad": "复合轧制", "general": "轧制工艺"}
    proc_name = process_names.get(process_type, "轧制工艺")
    if proc_name not in found_tech:
        found_tech.append(proc_name)
    while len(found_tech) < 3:
        found_tech.append("轧制实验")
    found_tech = found_tech[:3]
    found_result = ""
    for result, kws in result_keywords.items():
        for kw in kws:
            if kw in text:
                found_result = result
                break
        if found_result:
            break
    if not found_result:
        found_result = process_names.get(process_type, "轧制") + "优化"
    return " + ".join(found_tech) + " = " + found_result


def load_existing():
    if not os.path.exists(PAPERS_JS):
        return [], ""
    with open(PAPERS_JS, "r", encoding="utf-8") as f:
        src = f.read()
    start = src.find("const PAPERS = [")
    end = src.rfind("];")
    if start == -1 or end == -1:
        return [], src
    arr_str = src[start + len("const PAPERS = "):end + 1]
    try:
        papers = json.loads(arr_str)
    except:
        papers = []
    return papers, src


def deduplicate(new_papers, existing):
    existing_dois = {p.get("doi", "").lower().strip() for p in existing if p.get("doi")}
    existing_titles = {p.get("title", "").lower().strip()[:60] for p in existing}
    unique = []
    seen = set()
    for p in new_papers:
        doi = p.get("doi", "").lower().strip()
        title_key = p.get("title", "").lower().strip()[:60]
        if doi and doi in existing_dois:
            continue
        if title_key in existing_titles or title_key in seen:
            continue
        seen.add(title_key)
        unique.append(p)
    return unique


def main():
    print("=" * 60)
    print("  Rolling Papers Weekly - Auto Fetch")
    print(f"  Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"  Looking back {DAYS_BACK} days")
    print("=" * 60)
    existing, src = load_existing()
    print(f"\nExisting papers: {len(existing)}")
    all_new = []
    all_new.extend(fetch_arxiv())
    all_new.extend(fetch_crossref())
    all_new.extend(fetch_openalex())
    print(f"\nTotal fetched: {len(all_new)}")
    rolling = [p for p in all_new if is_rolling_related(p)]
    print(f"Rolling-related: {len(rolling)}")
    unique = deduplicate(rolling, existing)
    print(f"After dedup: {len(unique)} new papers")
    if not unique:
        print("\nNo new papers found. Done.")
        with open("_fetch_result.json", "w", encoding="utf-8") as f:
            json.dump({"new_count": 0, "total": len(existing)}, f, ensure_ascii=False)
        return
    print("\nProcessing new papers...")
    processed = []
    for i, p in enumerate(unique):
        print(f"  [{i+1}/{len(unique)}] {p['title'][:70]}...")
        direction = classify_direction(p)
        process_type = classify_process(p)
        title_cn = translate_text(p["title"])
        time.sleep(0.5)
        abstract = p.get("abstract", "")
        if abstract and len(abstract) > 20:
            innovation_cn = translate_long_text(abstract)
            if innovation_cn:
                innovation_cn = innovation_cn.strip()
                if not innovation_cn.endswith(("。", "！", "？", ".", "!", "?")):
                    innovation_cn += "。"
            else:
                innovation_cn = title_cn + "。主要涉及" + direction + "等方面的创新研究。"
        else:
            innovation_cn = title_cn + "。主要涉及" + direction + "等方面的创新研究。"
        formula = generate_formula(p["title"], abstract, direction, process_type)
        score = 7
        if len(abstract) > 1000:
            score = 8
        if any(kw in p["title"].lower() for kw in ["novel", "new", "innovative", "framework"]):
            score = 9
        if any(kw in p["title"].lower() for kw in ["review", "survey"]):
            score = 6
        max_id = 0
        for pp in existing + processed:
            m = re.search(r"\d+", pp.get("id", "p-000"))
            if m:
                max_id = max(max_id, int(m.group()))
        new_id = f"p-{max_id + 1:03d}"
        paper_obj = {"id": new_id, "title": p["title"], "titleCn": title_cn, "authors": p.get("authors", ""), "journal": p.get("journal", ""), "sourceType": p.get("sourceType", "SCI"), "year": p.get("year", datetime.datetime.now().year), "month": p.get("month", 1), "innovationScore": score, "field": direction, "processType": process_type, "innovationTags": [], "abstract": abstract, "innovationCn": innovation_cn, "innovationFormula": formula, "doi": p.get("doi", "")}
        processed.append(paper_obj)
        existing.append(paper_obj)
        time.sleep(0.5)
    if MAX_PER_DIR > 0:
        dir_papers = {}
        for p in existing:
            d = p.get("field", "process")
            dir_papers.setdefault(d, []).append(p)
        kept = []
        for d, plist in dir_papers.items():
            plist.sort(key=lambda x: -(x.get("innovationScore", 0)))
            kept.extend(plist[:MAX_PER_DIR])
        kept.sort(key=lambda x: x.get("id", ""))
        existing = kept
    new_papers_json = json.dumps(existing, ensure_ascii=False, indent=2)
    marker = "const PAPERS = "
    idx = src.find(marker)
    if idx >= 0:
        end_idx = src.rfind("];")
        new_src = src[:idx] + marker + new_papers_json + ";\n" + src[end_idx + 2:]
    else:
        new_src = marker + new_papers_json + ";\n"
    with open(PAPERS_JS, "w", encoding="utf-8") as f:
        f.write(new_src)
    print(f"\n{'=' * 60}")
    print(f"  Updated papers.js: +{len(processed)} new, {len(existing)} total")
    print(f"{'=' * 60}")
    with open("_fetch_result.json", "w", encoding="utf-8") as f:
        json.dump({"new_count": len(processed), "total": len(existing), "new_titles": [p["title"][:60] for p in processed]}, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\nError: {e}", file=sys.stderr)
        traceback.print_exc()
        with open("_fetch_result.json", "w", encoding="utf-8") as f:
            json.dump({"new_count": 0, "error": str(e)}, f, ensure_ascii=False)
        sys.exit(1)