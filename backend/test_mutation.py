from app.analysis.text import extract_sentences
from app.analysis.perplexity import analyze_perplexity
from app.analysis.burstiness import analyze_burstiness, sentence_rhythm_signal, rhythm_explanation
from app.analysis.features import extract_features, lexical_predictability_signal
from app.analysis.tropes import detect_tropes, trope_signal_score, trope_explanation
from app.analysis.scoring import score_passage
from app.analysis.evidence import build_signals, build_summary_explanation

essay = (
    "I have always been fascinated by technology. "
    "When I was younger, I built small projects with whatever materials I could find. "
    "One experiment failed repeatedly, but the failure taught me to approach problems differently. "
    "Eventually, I learned that understanding why something breaks can be more valuable than simply making it work."
)

sentences = extract_sentences(essay)

for sentence in sentences:
    original = sentence.text

    print("\n================================")
    print(sentence.id)
    print("START:", repr(sentence.text))

    # 1. Perplexity
    analyze_perplexity(sentence.text)
    print("AFTER perplexity:", repr(sentence.text))

    # 2. Burstiness
    lengths = [len(s.words) for s in sentences]
    b = analyze_burstiness(lengths)
    sentence_rhythm_signal(
        sentence_length=len(sentence.words),
        all_lengths=lengths,
    )
    rhythm_explanation(
        sentence_length=len(sentence.words),
        result=b,
    )
    print("AFTER burstiness:", repr(sentence.text))

    # 3. Tropes
    matches = detect_tropes(sentence.text)
    trope_signal_score(matches)
    trope_explanation(matches)
    print("AFTER tropes:", repr(sentence.text))

    # 4. Features
    features = extract_features(
        text=sentence.text,
        words=sentence.words,
        sentence_lengths=lengths,
    )
    print("AFTER features:", repr(sentence.text))

    # 5. Lexical
    lexical_predictability_signal(sentence.words)
    print("AFTER lexical:", repr(sentence.text))

    if sentence.text != original:
        print("!!! MUTATED !!!")
        print("BEFORE:", repr(original))
        print("AFTER :", repr(sentence.text))
    else:
        print("OK - unchanged")
