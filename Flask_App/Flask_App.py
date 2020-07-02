
from flask import render_template, request, flash, abort, Blueprint
from Flask_App.BusinessLogic.Text_Summarizer import TextSummarization

bp = Blueprint('Flask_App', __name__)


@bp.route('/', methods=['GET', 'POST'])
def index():
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
    return render_template('index.html', summary=summary)

@bp.route('/render', methods=['GET', 'POST'])
def render():
    return render_template('render.html')

@bp.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

