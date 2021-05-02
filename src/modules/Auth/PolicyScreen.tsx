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

const PolicyScreen: React.FC = () => {
  const navigation = useNavigation()
  const [lang, setlang] = useState('Japanese')
  return (
      <SafeAreaView>
        <View style={{paddingVertical: 10, paddingHorizontal: 20,backgroundColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#111827'}}>プライバシーポリシー</Text>
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
          <Text style={styles.textBlock}>  hiromuは、DoneHubアプリを広告付きアプリとして構築しました。本サービスは、hiromuが無償で提供するものであり、そのままの状態で利用することができます</Text>
          <Text style={styles.textBlock}>  このページは、お客様が本サービスをご利用になる際に、個人情報の収集、使用、開示についての方針をお知らせするためのものです。</Text>
          <Text style={styles.textBlock}>  お客様が私のサービスを利用することを選択された場合、お客様はこのポリシーに関連した情報の収集と使用に同意されたことになります。私が収集した個人情報は、本サービスの提供および改善のために使用されます。私は、本プライバシーポリシーに記載されている場合を除き、お客様の情報を第三者と使用または共有することはありません。</Text>
          <Text style={styles.textBlock}>  本プライバシーポリシーで使用されている用語は、本プライバシーポリシーで別途定義されていない限り、DoneHubでアクセス可能な当社の利用規約と同じ意味を持ちます。</Text>
          <Text style={styles.heading}>  情報の収集と使用</Text>
          <Text style={styles.textBlock}>  サービスをより快適にご利用いただくために、電話番号、メールアドレスなどの個人を特定できる情報の提供をお願いすることがあります。私が要求する情報は、お客様のデバイスに保持され、私が何らかの形で収集することはありません。</Text>
          <Text style={styles.textBlock}>  本アプリでは、お客様を特定するために使用される情報を収集する可能性のある第三者サービスを使用しています。</Text>
          <Text style={styles.textBlock}>  本アプリが使用する第三者サービスプロバイダーのプライバシーポリシーへのリンク</Text>
          <Text style={{paddingTop: 10}}>
            - 
        <OpenURLText url='https://developers.google.com/admob/terms'>AdMob</OpenURLText>
          </Text>
          <Text style={{paddingBottom: 10}}>
            - 
        <OpenURLText url='https://expo.io/terms'>Expo</OpenURLText>
          </Text>
          <Text style={styles.heading}> ログデータ</Text>
          <Text style={styles.textBlock}>お客様が私のサービスをご利用になる際、アプリにエラーが発生した場合、私はログデータと呼ばれるお客様の携帯電話上のデータや情報を（第三者製品を通じて）収集することをお知らせします。このログデータには、お客様の端末のインターネットプロトコル（IP）アドレス、端末名、オペレーティングシステムのバージョン、本サービス利用時のアプリの設定、本サービスを利用した日時、その他の統計情報などが含まれる場合があります。</Text>
          <Text style={styles.heading}> Cookies</Text>
          <Text style={styles.textBlock}>  Cookieとは、少量のデータを記録したファイルで、一般的に匿名の固有識別子として使用されます。これらは、お客様が訪問したウェブサイトからお客様のブラウザに送信され、お客様のデバイスの内部メモリに保存されます。</Text>
          <Text style={styles.textBlock}>  本サービスでは、この「Cookie」を明示的に使用していません。ただし、本アプリでは、情報収集やサービス向上のために、「Cookie」を使用する第三者のコードやライブラリを使用することがあります。お客様は、これらの「Cookie」を受け入れるか拒否するかを選択でき、また、「Cookie」がお客様のデバイスに送信されたことを知ることができます。お客様が当社のCookieを拒否することを選択した場合、本サービスの一部を利用できなくなることがあります。</Text>
          <Text style={styles.heading}>  サービス提供者</Text>
          <Text style={styles.textBlock}>私は、以下の理由で、第三者の企業や個人を雇用することがあります。</Text>
          <Text style={styles.textBlock}>•	私たちのサービスを促進するため。
•	私たちに代わって本サービスを提供するため。
•	本サービスに関連するサービスを提供するため
•	本サービスの利用状況の分析を支援するため。
          </Text>
          <Text style={styles.textBlock}>これらの第三者がお客様の個人情報にアクセスできることを、本サービスのユーザーの皆様にお知らせします。その理由は、当社に代わって彼らに割り当てられたタスクを実行するためです。ただし、これらの第三者は、他の目的のために情報を開示または使用しない義務があります。</Text>
          <Text style={styles.heading}>セキュリティ</Text>
          <Text style={styles.textBlock}>当社は、お客様の個人情報を提供してくださるお客様の信頼を大切にし、商業的に許容される手段を用いて個人情報を保護するよう努めています。しかし、インターネットでの送信方法や電子的な保存方法は、100％安全で信頼できるものではなく、その絶対的な安全性を保証することはできないことをご了承ください。</Text>
          <Text style={styles.heading}>他のサイトへのリンク</Text>
          <Text style={styles.textBlock}>  本サービスには、他のサイトへのリンクが含まれている場合があります。お客様が第三者のリンクをクリックすると、そのサイトに移動します。これらの外部サイトは、私が運営しているものではないことにご注意ください。したがって、これらのサイトのプライバシーポリシーを確認されることを強くお勧めします。私は、第三者のサイトやサービスのコンテンツ、プライバシーポリシー、または慣行を管理することはできず、責任を負いません。</Text>
          <Text style={styles.heading}>お子様のプライバシー</Text>
          <Text style={styles.textBlock}>本サービスは、13歳未満の方を対象とするものではありません。 私は、13歳未満のお子様から意図的に個人を特定できる情報を収集することはありません。13歳未満のお子様が私に個人情報を提供したことを発見した場合、私は直ちにこれを当社のサーバーから削除します。保護者の方で、お子様が個人情報を提供したことに気づかれた場合は、必要な措置を取らせていただきますので、私までご連絡ください。</Text>
          <Text style={styles.heading}>本プライバシーポリシーの変更</Text>
          <Text style={styles.textBlock}>私は、プライバシーポリシーを更新することがあります。そのため、お客様はこのページを定期的に確認し、変更点を確認することをお勧めします。変更があった場合は、このページに新しいプライバシーポリシーを掲載することで、お客様にお知らせします。
本ポリシーは、2021-05-02より有効となります
</Text>
          <Text style={styles.heading}>お問い合わせ</Text>
          <Text style={styles.textBlock}>私のプライバシーポリシーについてご質問やご提案がありましたら、ご遠慮なく 2147ya@gmail.com までご連絡ください</Text>
          <Text style={styles.textBlock}>このプライバシーポリシーページは、
          <OpenURLText url='https://www.privacypolicytemplate.net/'>privacypolicytemplate.net</OpenURLText>
          で作成され、
<OpenURLText url='https://app-privacy-policy-generator.nisrulz.com/'>App Privacy Policy Generator</OpenURLText>
          によって修正／生成されました。</Text>
        <Button
          containerStyle={{padding: 20}}
          title="同意する"
          buttonStyle={{backgroundColor: '#2563EB'}}
          onPress={() => navigation.navigate('LoginScreen')}
        />
        </View>
        :
        <View>
          <Text style={styles.textBlock}> Hiromu KAWAI built the DoneHub app as an Ad Supported app. This SERVICE is provided by Hiromu KAWAI at no cost and is intended for use as is.</Text>
          <Text style={styles.textBlock}> This page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service.</Text>
          <Text style={styles.textBlock}>  If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that I collect is used for providing and improving the Service. I will not use or share your information with anyone except as described in this Privacy Policy.</Text>
          <Text style={styles.textBlock}>  The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at DoneHub unless otherwise defined in this Privacy Policy.</Text>
          <Text style={styles.heading}>  Information Collection and Use</Text>
          <Text style={styles.textBlock}>  For a better experience, while using our Service, I may require you to provide us with certain personally identifiable information, including but not limited to phone number or email. The information that I request will be retained on your device and is not collected by me in any way.</Text>
          <Text style={styles.textBlock}>  The app does use third party services that may collect information used to identify you.</Text>
          <Text style={styles.textBlock}>  Link to privacy policy of third party service providers used by the app</Text>
          <Text style={{paddingTop: 10}}>
            - 
        <OpenURLText url='https://developers.google.com/admob/terms'>AdMob</OpenURLText>
          </Text>
          <Text style={{paddingBottom: 10}}>
            - 
        <OpenURLText url='https://expo.io/terms'>Expo</OpenURLText>
          </Text>
          <Text style={styles.heading}> Log Data</Text>
          <Text style={styles.textBlock}>I want to inform you that whenever you use my Service, in a case of an error in the app I collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing my Service, the time and date of your use of the Service, and other statistics.</Text>
          <Text style={styles.heading}> Cookies</Text>
          <Text style={styles.textBlock}>  Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.</Text>
          <Text style={styles.textBlock}>  This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service</Text>
          <Text style={styles.heading}>  Service Providers</Text>
          <Text style={styles.textBlock}> I may employ third-party companies and individuals due to the following reasons:</Text>
          <Text style={styles.textBlock}>•	To facilitate our Service;
•	To provide the Service on our behalf;
•	To perform Service-related services; or
•	To assist us in analyzing how our Service is used.

          </Text>
          <Text style={styles.textBlock}>I want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</Text>
          <Text style={styles.heading}>Security</Text>
          <Text style={styles.textBlock}>I value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security.</Text>
          <Text style={styles.heading}>Links to Other Sites</Text>
          <Text style={styles.textBlock}>  This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by me. Therefore, I strongly advise you to review the Privacy Policy of these websites. I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</Text>
          <Text style={styles.heading}>Children’s Privacy</Text>
          <Text style={styles.textBlock}>These Services do not address anyone under the age of 13. I do not knowingly collect personally identifiable information from children under 13 years of age. In the case I discover that a child under 13 has provided me with personal information, I immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact me so that I will be able to do necessary actions.</Text>
          <Text style={styles.heading}>Changes to This Privacy Policy</Text>
          <Text style={styles.textBlock}>I may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. I will notify you of any changes by posting the new Privacy Policy on this page.
This policy is effective as of 2021-05-02
</Text>
          <Text style={styles.heading}>Contact Us</Text>
          <Text style={styles.textBlock}>If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact me at 2147ya@gmail.com.</Text>
          <Text style={styles.textBlock}>
          This privacy policy page was created at 
          <OpenURLText url='https://www.privacypolicytemplate.net/'>privacypolicytemplate.net</OpenURLText>
           and modified/generated by <OpenURLText url='https://app-privacy-policy-generator.nisrulz.com/'>App Privacy Policy Generator</OpenURLText>
          によって修正／生成されました。</Text>
        <Button
          containerStyle={{padding: 20}}
          title="同意する"
          buttonStyle={{backgroundColor: '#2563EB'}}
          onPress={() => navigation.navigate('LoginScreen')}
        />
        </View>  
        }
          
        </ScrollView>
      </SafeAreaView>
  )
}

export default PolicyScreen

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
