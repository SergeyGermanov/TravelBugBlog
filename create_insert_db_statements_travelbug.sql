CREATE TABLE user ( 
	username VARCHAR ( 20 ) NOT NULL,
	password VARCHAR ( 10 ), 
	fname VARCHAR ( 100 ), 
	lname VARCHAR ( 100 ), 
	DOB DATE, 
	country VARCHAR ( 100 ), 
	description TEXT, 
	avatar VARCHAR(200), 
	PRIMARY KEY(username) 
)

CREATE TABLE article ( 
	article_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	title VARCHAR ( 300 ), 
	content TEXT, 
	username VARCHAR ( 20 ) NOT NULL, 
	videoAudio TEXT, 
	FOREIGN KEY(username) REFERENCES user(username) 
)

CREATE TABLE comment ( 
	comment_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
	comment_content TEXT, 
	article_ID INTEGER NOT NULL, 
	username VARCHAR ( 20 ), 
	FOREIGN KEY(username) REFERENCES user(username), FOREIGN KEY(article_ID) REFERENCES article(article_ID) 
)

INSERT INTO user VALUES ('thomastrex', 'xxx88yyy', 'Thomas', 'T-rex', 1988-12-25, 'New Zealand', 'I am Thomas the T-rex! Nice to meet you all!', 'Jamie Lannister.jpg');
INSERT INTO user VALUES ('jsmith77', 'thevoid78', 'James', 'Smith', 1966-01-22, 'Australia', 'Hi guys, nice to meet you. Look forward to my articles!', 'Littlefinger.jpg');
INSERT INTO user VALUES ("winniep", "piglet7", "Winnie", "Pooh", "1853-05-30", "United Kingdom", "I am Winnie the Pooh. Think, think, think. Ooooh, HONEY!", "Ramsay.jpg");
INSERT INTO user VALUES ("tigger1", "number1", "Tigger", "Tiger", "1853-06-30", "United Kingdom", "I am better than Winnie the Pooh. Tiggers are the bestest!", "Hound.jpg");
INSERT INTO user VALUES ("hnia685", "saxophone", "Clare", "Niap", "1998-05-06", "New Zealand", "Why is a raven like a writing desk?", "Sansa.jpg");

INSERT INTO article VALUES ("1", "Hey we want some new face", "<p>Maecenas luctus lacus tempor ante mattis viverra. Vestibulum vel auctor metus, ultricies euismod lacus. In vitae augue quis felis ullamcorper finibus a vel dui. Proin lacus erat, accumsan ac gravida vitae, malesuada eget ipsum. Cras a mollis nisl, vel semper nulla. Ut non ultricies nisl, non tincidunt ligula. In lacinia dignissim nulla eu viverra. Sed luctus sagittis consectetur. Nulla vulputate tortor ut maximus convallis. Aliquam tempus finibus nulla sed congue. Quisque molestie lectus urna, non condimentum quam volutpat at. Praesent elit sapien, luctus ultricies nibh fringilla, venenatis fringilla dolor. Mauris mollis aliquet mattis. Cras a elementum justo, ac pharetra massa.</p>
<p>Nulla vel ligula viverra, porttitor lorem id, scelerisque purus. Donec posuere et dolor ut iaculis.&nbsp;<img src='http://localhost:3000/gallery/users/jsmith77/15-kayaking.jpg' alt="" width='800' height='600' /></p>
<p>Curabitur vehicula neque elit, sed faucibus tortor laoreet vitae. Aliquam erat volutpat. Pellentesque sodales neque sed blandit feugiat. Donec iaculis neque ipsum, sed accumsan leo lobortis ut. Nunc ullamcorper, felis sit amet efficitur gravida, est tellus iaculis arcu, quis tristique nulla elit ut ligula. Suspendisse ultrices iaculis est, id eleifend augue ornare in. Nulla facilisi. Donec nunc erat, condimentum nec ornare eget, ornare ac est. Curabitur mauris purus, tempor ut leo sit amet, interdum sagittis dui. Vestibulum facilisis, diam at gravida cursus, metus massa hendrerit urna, quis commodo ante lectus id urna.</p>
<p>&nbsp;</p>
<p><img style='display: block; margin-left: auto; margin-right: auto;' src='http://localhost:3000/../gallery/users/jsmith77/img_3726-l.jpg' alt="" width='800' height='600' /></p>", "jsmith77", null);
INSERT INTO article VALUES ("2", "A meaty article", "Bacon ipsum dolor amet frankfurter salami flank andouille bresaola, hamburger biltong. Pig kevin drumstick landjaeger. Leberkas pastrami filet mignon tenderloin cow. Ham ball tip drumstick andouille boudin landjaeger swine cow. Biltong rump beef ribs pork chop landjaeger. Pork frankfurter leberkas jowl pancetta shankle shank chuck meatball cow sirloin tail flank capicola.<br><br>Turkey alcatra venison landjaeger ham hock doner ball tip capicola swine bacon picanha burgdoggen. Sausage hamburger shank pig tongue turducken. Landjaeger cow prosciutto porchetta fatback shoulder corned beef beef ribs doner meatball rump bresaola venison beef. Fatback andouille pork chop picanha, doner cupim meatball burgdoggen jowl bresaola. Shankle jerky pork loin picanha sirloin bresaola meatloaf, pork belly pastrami doner. Pork loin pork belly biltong filet mignon short ribs chuck pastrami pig t-bone pork chop frankfurter.", "thomastrex", null);
INSERT INTO article VALUES ("3", "An article title", "Kevin capicola cupim pastrami tenderloin picanha pork belly strip steak turducken chuck pig pancetta bresaola. Kielbasa shank pork loin drumstick turkey capicola fatback. Ham hock short loin kielbasa biltong, boudin pork chop chicken salami beef doner prosciutto ground round alcatra. Pork chop beef swine turkey alcatra ribeye short ribs doner jerky pancetta. Tail salami tongue, bresaola kevin venison ball tip corned beef spare ribs burgdoggen alcatra pastrami.<br><br>Rump ribeye doner leberkas jerky. Spare ribs drumstick corned beef filet mignon chuck boudin, ham hock beef. Meatball salami shankle porchetta cow drumstick pork loin venison doner flank tenderloin sausage ground round short ribs. Landjaeger tongue cow, shankle picanha salami jerky sausage shoulder andouille doner jowl swine pastrami sirloin. Strip steak boudin picanha meatball jerky ground round landjaeger sirloin chuck t-bone sausage kevin pork biltong porchetta. Swine venison prosciutto landjaeger chuck short ribs kielbasa.", "jsmith77", null);
INSERT INTO article VALUES ("4", "Neque porro quisquam est qui", "Neque porro quisquam est qui', 'Bacon shankle flank, landjaeger capicola burgdoggen shank cow venison biltong rump ground round ham. Shankle jerky sirloin porchetta, cupim short loin bresaola pork chop jowl tri-tip chuck capicola. Meatloaf shankle sausage spare ribs frankfurter jerky. Bresaola jerky burgdoggen, filet mignon leberkas corned beef ham. Turducken cow meatball venison tail doner bacon turkey landjaeger biltong chicken. Beef ribs pork belly tail rump. Hamburger alcatra biltong, ground round pastrami chicken turducken.", "winniep", null);
INSERT INTO article VALUES ("5", "Some lorem ipsum information", "Some lorem ipsum information', 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of ""de Finibus Bonorum et Malorum"" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, ""Lorem ipsum dolor sit amet.."", comes from a line in section 1.10.32.<br><br>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from ""de Finibus Bonorum et Malorum"" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.", "tigger1", null);
INSERT INTO article VALUES ("13", "HEY HOOOO", "<h2>Advantages of a WYSIWYG editor</h2>
<p>The nice thing about a WYSIWYG editor is that your site users don't have to understand HTML in order to produce richly formatted content. This makes WYSIWYG editors great for content management systems, blogging systems, webmail applications, or any situation where you want people to be able to enter rich content via a Web form.</p>
<p>Even if you're familiar with HTML, you'll probably find it quicker to enter and format text using a WYSIWYG editor than hand-coding your HTML markup and CSS.</p>
<h2>Disadvantages of a WYSIWYG editor</h2>
<p>One problem with WYSIWYG HTML editors is that they tend to churn out poor-quality, bloated HTML, although recent editors have improved their HTML output considerably.</p>
<p>Another problem is that users of a content management system with a WYSIWYG editor can easily break the style conventions of a site by adding their own non-standard formatting (see&nbsp;<a href=""http://www.elated.com/forums/topic/1243/"">Inline HTML editors ruin your brand</a>). For example, the site's style guide might stipulate that all headings should be green, but the user decides to create a red heading in the WYSIWYG editor. It's hard to prevent this kind of problem using WYSIWYG HTML editors (although you can lock them down to a certain extent).</p>", "hnia685", null);

INSERT INTO comment VALUES ("1", "AWESOME!!!!", "1", "hnia685");
INSERT INTO comment VALUES ("6", "AWESOME!!!!", "1", "winniep");
INSERT INTO comment VALUES ("17", "brilliant", "13", "hnia685");
INSERT INTO comment VALUES ("30", "Bloody hell --Ron Weasley", "13", "hnia685");
INSERT INTO comment VALUES ("35", "testing!", "4", "jsmith77");
INSERT INTO comment VALUES ("39", "srfgobn", "13", "hnia685");
INSERT INTO comment VALUES ("42", "ehoh", "2", "hnia685");
INSERT INTO comment VALUES ("54", "hey ho", "3", "jsmith77");
INSERT INTO comment VALUES ("56", "slayyyyyy", "2", "jsmith77");