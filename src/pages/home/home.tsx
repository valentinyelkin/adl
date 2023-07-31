import React, { useEffect } from 'react';
import styles from './home.module.scss';
import logo from '../../images/logo.svg';
import DeepLinker from '../../helper/deeplinker';

export const Home = () => {

  useEffect(() => {
    const pathname = window.location.pathname.slice(1);

    const search = window.location.search;

    console.log(pathname, 'pathname');
    console.log(search, 'search')

    function isValidHttpUrl(maybeUrl: string) {
      let url;
      try {
        url = new URL(maybeUrl);
      } catch (_) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    }

    const linker = new DeepLinker({
      onIgnored: function() {
        console.log('browser failed to respond to the deep link');
      },
      onFallback: function() {
        console.log('dialog hidden or user returned to tab');
      },
      onReturn: function() {
        console.log('user returned to the page from the native app');
      },
    });

    console.log(isValidHttpUrl(pathname + search), 'isValidHttpUrl');

    isValidHttpUrl(pathname + search) && linker.openURL(pathname + search);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <img src={logo} alt="app-logo"/>
      </div>
      <div>
      </div>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>
          Hold on, the app is deeplinking
        </h1>
      </div>
    </div>
  );
};
