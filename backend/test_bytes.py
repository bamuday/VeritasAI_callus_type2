from app.analysis.text import extract_sentences

essay = (
    "I have always been fascinated by technology. "
    "When I was younger, I built small projects with whatever materials I could find. "
    "One experiment failed repeatedly, but the failure taught me to approach problems differently. "
    "Eventually, I learned that understanding why something breaks can be more valuable than simply making it work."
)

sentences = extract_sentences(essay)

for s in sentences:
    print("\n", s.id)
    print("repr :", repr(s.text))
    print("bytes:", s.text.encode("utf-8"))
    print("hex  :", s.text.encode("utf-8").hex())

    for phrase in [
        "by technology",
        "the failure",
        "taught me",
        "understanding why",
        "more valuable",
    ]:
        print(
            repr(phrase),
            "=>",
            phrase in s.text,
        )
