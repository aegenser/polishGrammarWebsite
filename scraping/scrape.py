# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup as bsoup
from bs4.element import Tag 
from urllib.parse import quote
from urllib import request
import json
import time
import re


LETTERS = set(list('aąbcćdeęfghijklłmnńoóprsśtuwyzźż'))
PLURALITIES = ['singular', 'plural']
CASES = ['mianownik', 'dopełniacz', 'celownik', 'biernik', 'narzędnik', 'miejscownik', 'wołacz']

def scrape_noun(noun):
    encoded = quote(noun)
    url = "https://en.wiktionary.org/wiki/" + encoded

    client = request.urlopen(url).read()
    soup = bsoup(client, 'lxml')
    body = soup.body

    polish_subtitle = body.find(id="Polish").parent
    current_section = polish_subtitle

    feminine = False
    neuter = False
    masculine = False
    animate = False
    inanimate = False
    virile = False

    while(current_section != None):
        gender = current_section.find(attrs={'class':'gender'})
        if gender != None:
            if gender.find(attrs={'title':'feminine gender'}):
                feminine = True
            elif gender.find(attrs={'title':'neuter gender'}):
                neuter = True
            elif gender.find(attrs={'title':'masculine gender'}):
                masculine = True
                if gender.find(attrs={'title':'personal'}):
                    animate = True
                    virile = True
                elif gender.find(attrs={'title':'animate'}):
                    animate = True
                else:
                    inanimate = True
            break
        current_section = current_section.next_sibling.next_sibling

    if not (feminine or neuter or masculine):
        print("no gender")
        return None

    if masculine and not (animate or inanimate):
        print("not animate or inanimate")
        return None

    if (animate and inanimate):
        print("both animate and inanimate")
        return None

    word = {}
    word['animate'] = animate
    word['singular'] = {}
    word['plural'] = {}

    while(current_section != None):
        declension = current_section.find(id=re.compile('Declension'))
        if declension != None:
            declensionTable = \
                current_section.next_sibling.next_sibling
            break
        current_section = current_section.next_sibling.next_sibling

    entries = declensionTable.find_all('a')

    print(declension)
    print(declensionTable)

    if len(entries) != 14:
        print("wrong number of entries in table - " + str(len(entries)))
        return None

    i = 0

    for case in CASES:
        for plurality in PLURALITIES:
            spelling = str(entries[i].string)
            # print(spelling)
            for character in spelling:
                if character not in LETTERS:
                    print("wrong letter found - " + character)
                    return None

            word[plurality][case] = spelling
            i += 1

    return (feminine, masculine, neuter, virile, word)


nouns = {'masculine': {'virile' : [], 'nonvirile' : []},
    "feminine" : [], "neuter" : []}

word_list = "ananas"

# word_list = "tydzień rok sekunda godzina minuta woda kawa piwo lód herbata matka ojciec mąż żona syn córka ryba wołowina wieprzowina kurczak kuchnia łazienka komputer łóżko kanapa pielęgniarka hotel kobieta mężczyzna dziewczyna chłopak dziecko lekarz nauczycielka nauczyciel jutro wczoraj głowa deszcz śnieg chmura but koszula skarpeta spodnie kolega dziewczynka dorosły telewizor chłopiec koleżanka muzeum życie kot pies dom stół smok telefon miłość torba pan pani profesor człowiek warzywo las rzecz osoba stan kraj strona kampus uniwersytet podręcznik przedmiot śniadanie obiad kolacja ryż chleb masło ziemniak kartofel truskawka pieróg malina jagoda borówka ananas kiełbasa kapusta sałatka marchewka rzodkiewka jajko kanapka widelec czajnik garnek talerz nóż łyżka patelnia deska miska zlew toster mikrofalówka kuchenka szuflada piekarnik kran szklanka filiżanka lodówka suszarka zamrażarka ścierka mikser krzesło lampa szafa żarówka kosz obraz odkurzacz kanapa grzejnik mebel głośnik zamek mydło umywalka szampon pralka ręcznik dezodorant lustro prysznic gąbka proszek wanna krem papier pasta żel kosmetyk maszynka łóżko zabawka budzik poduszka koc stolik pościel prześcieradło poszewka półka telewizor książka fotel regał kominek zegar płyta monitor biurko kanapa radio pilot kurtka pasek koszula naszyjnik ubranie portfel sukienka czapka piżama szalik płaszcz skarpetka spódnica rękawiczka sandał moda rękaw krawat futro sklep stoisko kiosk apteka cukiernia targ piekarnia księgarnia kwiaciarnia oko"

for noun in set(list(word_list.split())):
    try: 
        scraped_word = scrape_noun(noun)
    except:
        print("exception")
        scraped_word = None

    if scraped_word == None:
        print(noun + ': failure')
        continue

    feminine, masculine, neuter, virile, word = scraped_word

    if feminine:
        nouns['feminine'].append(word)
    elif neuter:
        nouns['neuter'].append(word)
    elif virile:
        nouns['masculine']['virile'].append(word)
    else:
        nouns['masculine']['nonvirile'].append(word)

    print(noun + ': success')
    time.sleep(1)

with open('nouns.json', 'w') as outfile:
    json.dump(nouns, outfile)

    
    