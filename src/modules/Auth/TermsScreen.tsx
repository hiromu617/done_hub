import React, { useEffect, useState, useCallback } from 'react';
import { ListItem, Avatar, Icon, Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet,View, Text, SafeAreaView,Linking,Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const OpenURLText = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Text onPress={handlePress} style={{color: 'blue'}}>{children}</Text>;
};

const TermsScreen: React.FC = () => {
  const navigation = useNavigation()
  const [lang, setlang] = useState('Japanese')
  return (
      <SafeAreaView>
        <View style={{paddingVertical: 10, paddingHorizontal: 20,backgroundColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#111827'}}>利用規約</Text>
          <View  style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            {lang === 'Japanese' ?
            <Button
              title='English'
              type='clear'
              buttonStyle={{height: 40}}
              onPress={() => setlang('English')}
            />
            :
            <Button
              title='日本語'
              type='clear'
              buttonStyle={{height: 40}}
              onPress={() => setlang('Japanese')}
            />
          }
          <Icon
            style={{paddingLeft: 10}}
            name='close'
            onPress={() => navigation.navigate('LoginScreen')}
          />
          </View>
        </View>
        <ScrollView style={{paddingHorizontal: 10, paddingTop: 20, marginBottom: 50}}>
          {lang === 'Japanese' ? 
        <View>
          <Text style={styles.textBlock}>  本アプリをダウンロードまたは使用することにより、本規約が自動的に適用されます。したがって、本アプリを使用する前に、本規約をよくお読みください。お客様は、本アプリ、本アプリの一部、または当社の商標をいかなる方法でもコピー、変更することはできません。また、アプリのソースコードを抽出しようとしたり、アプリを他の言語に翻訳したり、派生バージョンを作成したりすることもできません。本アプリ自体、および本アプリに関連するすべての商標、著作権、データベース権、その他の知的財産権は、引き続きhiromuに帰属します。</Text>
          <Text style={styles.textBlock}>  hiromu(
          <OpenURLText url='https://twitter.com/hiromu666666'>@hiromu666666</OpenURLText>
          )は、本アプリが可能な限り便利で効率的なものとなるよう努めています。そのため、当社は、いつでも、いかなる理由でも、本アプリを変更したり、そのサービスに課金したりする権利を留保します。私たちは、お客様に何をお支払いいただくのかを明確にしないまま、アプリやサービスの料金を請求することはありません。</Text>
          <Text style={styles.textBlock}>  DoneHubアプリは、本サービスを提供するために、お客様から提供された個人情報を保存・処理します。お使いの携帯電話とアプリへのアクセスを安全に保つのはお客様の責任です。そのため、お使いの携帯電話を「jailbreak」したり、ルート化したりしないことをお勧めします。「jailbreak」とは、お使いの携帯電話の公式OSが課しているソフトウェアの制限や制約を取り除く作業です。このような行為は、お使いの携帯電話がマルウェアやウイルス、悪意のあるプログラムに対して脆弱になり、携帯電話のセキュリティ機能が低下したり、DoneHubアプリが正常に動作しなくなる可能性があります。</Text>
          <Text style={styles.textBlock}>  また、DoneHubアプリは第三者のサービスを利用していますが、第三者のサービスには利用規約があります。</Text>
          <Text style={styles.textBlock}>  アプリが使用している第三者サービスの利用規約へのリンク
          </Text>
          <Text style={{paddingTop: 10}}>
            - 
        <OpenURLText url='https://developers.google.com/admob/terms'>AdMob</OpenURLText>
          </Text>
          <Text style={{paddingBottom: 10}}>
            - 
        <OpenURLText url='https://expo.io/terms'>Expo</OpenURLText>
          </Text>
          <Text style={styles.textBlock}>  お客様は、hiromuが責任を負わないものがあることをご了承ください。アプリの一部の機能は、アプリがアクティブなインターネット接続を持っていることを必要とします。Wi-Fiまたは携帯電話会社から提供されるインターネット接続が必要となりますが、Wi-Fiにアクセスできず、データ使用量が残っていない場合、アプリが完全に動作しないことについて、hiromuは責任を負いません。
Wi-Fiのある場所以外でアプリを使用する場合は、携帯電話会社との契約条件が適用されますので、ご注意ください。その結果、アプリにアクセスしている間の接続期間中のデータ料金や、その他の第三者の料金が携帯電話会社から請求される場合があります。本アプリを使用することにより、お客様は、データローミングをオフにせずにホームテリトリー（地域や国）外で本アプリを使用した場合のローミングデータ料金を含め、そのような料金に対する責任を受け入れることになります。また、お客様がアプリを使用している端末の料金支払者でない場合は、アプリの使用について料金支払者の許可を得ているものとみなしますので、ご了承ください。
</Text>
          <Text style={styles.textBlock}>  同様に、お客様のアプリの使用方法についても、hiromuは常に責任を負うことはできません。例えば、お客様のデバイスが充電されていることを確認する必要がありますが、バッテリーが切れて本サービスを利用できない場合、hiromuは責任を負いません。</Text>
          <Text style={styles.textBlock}>  アプリの使用に関するhiromuの責任については、お客様がアプリを使用する際に、当社は常に最新で正しい情報を提供するよう努力していますが、お客様がアプリを利用できるようにするために第三者からの情報提供に依存していることを念頭に置くことが重要です。hiromuは、本アプリの機能に全面的に依存した結果、お客様が被った直接的または間接的な損失について、一切の責任を負いません。</Text>
          <Text style={styles.textBlock}>  ある時点で、私たちはこのアプリをアップデートする可能性があります。本アプリは現在iOSで提供されていますが、システム（および当社が本アプリの提供範囲を拡大することを決定した追加のシステム）の要件が変更される可能性がありますので、本アプリを継続して使用したい場合は、アップデートをダウンロードする必要があります。hiromuは、本アプリがお客様にとって適切であり、かつ、お客様のデバイスにインストールされているすべてのiOSのバージョンで動作するように、本アプリを常にアップデートすることを保証できません。また、当社は、本アプリの提供を停止する場合があり、お客様に終了の通知をすることなく、いつでも本アプリの使用を終了することができます。当社が別段の指示をしない限り、終了の際には、(a)本規約でお客様に付与された権利およびライセンスは終了し、(b)お客様は本アプリの使用を中止し、必要に応じてお客様のデバイスから本アプリを削除しなければなりません。</Text>

          <Text style={styles.heading}>本規約の変更</Text>
          <Text style={styles.textBlock}>  私は、本規約を更新することがあります。したがって、お客様は、本ページを定期的に確認し、変更点を確認することをお勧めします。変更があった場合は、このページに新しいご利用条件を掲載してお知らせします。
本規約は2021-05-02より有効となります
          </Text>
          <Text style={styles.heading}>お問い合わせ</Text>
          <Text style={styles.textBlock}>  私の利用規約に関するご質問やご提案がありましたら、遠慮なく 2147ya@gmail.com までご連絡ください。
この利用規約のページは、
<OpenURLText url='https://app-privacy-policy-generator.nisrulz.com/'>App Privacy Policy Generator</OpenURLText>
  によって生成されました
</Text>
        <Button
          containerStyle={{padding: 20}}
          title="同意する"
          buttonStyle={{backgroundColor: '#2563EB'}}
          onPress={() => navigation.navigate('LoginScreen')}
        />
        </View>
        :
        <View>
          <Text style={styles.textBlock}> By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app. You’re not allowed to copy, or modify the app, any part of the app, or our trademarks in any way. You’re not allowed to attempt to extract the source code of the app, and you also shouldn’t try to translate the app into other languages, or make derivative versions. The app itself, and all the trade marks, copyright, database rights and other intellectual property rights related to it, still belong to hiromu.</Text>
          <Text style={styles.textBlock}> hiromu(
          <OpenURLText url='https://twitter.com/hiromu666666'>@hiromu666666</OpenURLText>
            ) is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you’re paying for.</Text>
          <Text style={styles.textBlock}> The DoneHub app stores and processes personal data that you have provided to us, in order to provide my Service. It’s your responsibility to keep your phone and access to the app secure. We therefore recommend that you do not jailbreak or root your phone, which is the process of removing software restrictions and limitations imposed by the official operating system of your device. It could make your phone vulnerable to malware/viruses/malicious programs, compromise your phone’s security features and it could mean that the DoneHub app won’t work properly or at all.</Text>
          <Text style={styles.textBlock}> The app does use third party services that declare their own Terms and Conditions.</Text>
          <Text style={styles.textBlock}> Link to Terms and Conditions of third party service providers used by the app
          </Text>
          <Text style={{paddingTop: 10}}>
            - 
        <OpenURLText url='https://developers.google.com/admob/terms'>AdMob</OpenURLText>
          </Text>
          <Text style={{paddingBottom: 10}}>
            - 
        <OpenURLText url='https://expo.io/terms'>Expo</OpenURLText>
          </Text>
          <Text style={styles.textBlock}> You should be aware that there are certain things that hiromu will not take responsibility for. Certain functions of the app will require the app to have an active internet connection. The connection can be Wi-Fi, or provided by your mobile network provider, but hiromu cannot take responsibility for the app not working at full functionality if you don’t have access to Wi-Fi, and you don’t have any of your data allowance left.
</Text>
          <Text style={styles.textBlock}> Along the same lines, hiromu cannot always take responsibility for the way you use the app i.e. You need to make sure that your device stays charged – if it runs out of battery and you can’t turn it on to avail the Service, hiromu cannot accept responsibility.</Text>
          <Text style={styles.textBlock}> With respect to hiromu’s responsibility for your use of the app, when you’re using the app, it’s important to bear in mind that although we endeavour to ensure that it is updated and correct at all times, we do rely on third parties to provide information to us so that we can make it available to you. hiromu accepts no liability for any loss, direct or indirect, you experience as a result of relying wholly on this functionality of the app.</Text>
          <Text style={styles.textBlock}> At some point, we may wish to update the app. The app is currently available on iOS – the requirements for system(and for any additional systems we decide to extend the availability of the app to) may change, and you’ll need to download the updates if you want to keep using the app. hiromu does not promise that it will always update the app so that it is relevant to you and/or works with the iOS version that you have installed on your device. However, you promise to always accept updates to the application when offered to you, We may also wish to stop providing the app, and may terminate use of it at any time without giving notice of termination to you. Unless we tell you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must stop using the app, and (if needed) delete it from your device.</Text>

          <Text style={styles.heading}> Changes to This Terms and Conditions</Text>
          <Text style={styles.textBlock}> I may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes. I will notify you of any changes by posting the new Terms and Conditions on this page.
These terms and conditions are effective as of 2021-05-02

          </Text>
          <Text style={styles.heading}> Contact Us</Text>
          <Text style={styles.textBlock}> If you have any questions or suggestions about my Terms and Conditions, do not hesitate to contact me at 2147ya@gmail.com.
This Terms and Conditions page was generated by  
<OpenURLText url='https://app-privacy-policy-generator.nisrulz.com/'>App Privacy Policy Generator</OpenURLText>
</Text>
        <Button
          containerStyle={{padding: 20}}
          title="Agree"
          buttonStyle={{backgroundColor: '#2563EB'}}
          onPress={() => navigation.navigate('LoginScreen')}
        />
        </View>  
        }
          
        </ScrollView>
      </SafeAreaView>
  )
}

export default TermsScreen

const styles = StyleSheet.create({
  textBlock: {
    paddingBottom: 20, 
    fontSize: 16, 
    lineHeight: 20,
    color: '#1F2937'
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
    color: '#111827'
  }
})