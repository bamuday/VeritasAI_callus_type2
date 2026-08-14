from app.analysis.text import normalize_text, extract_sentences

essay = (
    "I have always been fascinated by technology. "
    "When I was younger, I built small projects with whatever materials I could find. "
    "One experiment failed repeatedly, but the failure taught me to approach problems differently. "
    "Eventually, I learned that understanding why something breaks can be more valuable than simply making it work."
)

normalized = normalize_text(essay)
sentences = extract_sentences(essay)

print("NORMALIZED:")
print(repr(normalized))

print("\nSENTENCES:")
for sentence in sentences:
    print(sentence.index, repr(sentence.text))

print("\nCHARACTER CHECK:")

for phrase in [
    "the failure",
    "taught me",
    "understanding why",
    "compared with",
]:
    print(
        repr(phrase),
        "=>",
        repr(phrase in normalized),
    )
