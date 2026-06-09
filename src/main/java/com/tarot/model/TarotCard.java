package com.tarot.model;

public class TarotCard {
    private int id;
    private String name;
    private String nameEn;
    private String arcana;
    private String suit;
    private String keywords;
    private String meaning;
    private String reversedMeaning;
    private boolean reversed;

    public TarotCard() {}

    public TarotCard(int id, String name, String nameEn, String arcana, String suit,
                     String keywords, String meaning, String reversedMeaning) {
        this.id = id;
        this.name = name;
        this.nameEn = nameEn;
        this.arcana = arcana;
        this.suit = suit;
        this.keywords = keywords;
        this.meaning = meaning;
        this.reversedMeaning = reversedMeaning;
        this.reversed = false;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    public String getArcana() { return arcana; }
    public void setArcana(String arcana) { this.arcana = arcana; }
    public String getSuit() { return suit; }
    public void setSuit(String suit) { this.suit = suit; }
    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }
    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }
    public String getReversedMeaning() { return reversedMeaning; }
    public void setReversedMeaning(String reversedMeaning) { this.reversedMeaning = reversedMeaning; }
    public boolean isReversed() { return reversed; }
    public void setReversed(boolean reversed) { this.reversed = reversed; }
}
