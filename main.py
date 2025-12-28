import streamlit as st
import helper
import pickle

model = pickle.load(open('model.pkl','rb'))

st.header('sentiment analysis for reviews')

text=st.text_input('Enter text')

if st.button('Find'):
    query = helper.last_preprocess(text)
    result = int(model.predict(query))

    if result==1:
        st.header('positive review')
    else:
        st.header('negative review')
