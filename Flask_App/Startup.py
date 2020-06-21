from flask import Flask
from flask import render_template, request, flash
from BusinessLogic.Text_Summarizer import TextSummarization

app = Flask(__name__)
app.secret_key = '09619472778ffaeb028f86633fea2f45'


@app.route('/', methods=['GET', 'POST'])
def Index():
    summary = ''
    if request.method == 'POST':
        input_text = request.form['inputText']
        summarize_techniques = request.form['summarizeTechniques']
        if not input_text:
            flash('Please provide input text', 'danger')
        else:
            try:
                ts = TextSummarization()
                if summarize_techniques == 'TextRank':
                    summary = ts.generate_summary_textrank(input_text, 2)
                elif summarize_techniques == 'Gensim':
                    summary = ts.generate_summary_gensim(input_text)
                elif summarize_techniques == 'TextTeaser':
                    summary = ts.generate_summary_textteaser(input_text)
                flash('Viola!, your text is summarized using {0} algorithm'
                      .format(summarize_techniques), 'success')
            except Exception as e:
                flash(str(e), 'danger')
    return render_template('Index.html', summary=summary)
