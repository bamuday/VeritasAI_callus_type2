from app.analysis.pipeline import analyze_essay

essay = """I have always been fascinated by technology. When I was younger, I built small projects with whatever materials I could find. One experiment failed repeatedly, but the failure taught me to approach problems differently. Eventually, I learned that understanding why something breaks can be more valuable than simply making it work."""

print("INPUT:")
print(repr(essay))

result = analyze_essay(essay)

print("\nRESULT:")
for sentence in result.sentences:
    print(sentence.id, repr(sentence.text))

print("\nRAW TEXT:")
print(repr(result.rawText))

print("\nINPUT == RAW:")
print(essay == result.rawText)
